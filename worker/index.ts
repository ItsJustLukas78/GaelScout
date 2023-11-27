import { EventMatch } from '@/app/types';

const installEvent = () => {
  self.addEventListener('install', () => {
    // console.log('service worker installed');
  });
};

installEvent();

const activateEvent = () => {
  self.addEventListener('activate', event => {
    // @ts-ignore
    event.waitUntil(self.clients.claim());
    // console.log('service worker activated');
  });
};

activateEvent();

class PushNotification {
  private notifiedEvent: EventMatch | null = null;
  private numberOfEventsBefore: number = 4;

  constructor(event: EventMatch, numberOfEventsBefore: number = 4) {
    if (!event) {
      throw new Error('Event not provided');
    }

    this.notifiedEvent = event;
    this.numberOfEventsBefore = numberOfEventsBefore;
  }

  private async notificationError(message: string) {
    // @ts-ignore
    await self.registration.showNotification("Match Notification", {
      body: message,
      icon: "/GaelScoutLogo2024.png",
    });
  }

  private async completeNotification() {
    // @ts-ignore
    await self.registration.showNotification("Match Notification", {
      body: "Match " + this.notifiedEvent?.name + " is coming up soon!",
      icon: "/GaelScoutLogo2024.png",
    });
  }

  private async fetchMatchDifference() {
    const response = await fetch(
      `/api/events/${(this.notifiedEvent as EventMatch).eventId}/${(this.notifiedEvent as EventMatch).divisionId}/matchDifference?matchnum=` + this.notifiedEvent?.matchnum + '&round=' + this.notifiedEvent?.round + '&instance=' + this.notifiedEvent?.instance
    );

    return await response.json();
  }

  public async checkMatchDifferenceLoop(): Promise<ReturnType<typeof setInterval>> {
    const intervalFunction = async () => {
      try {
        const matchDifferenceData = await this.fetchMatchDifference();

        if (matchDifferenceData.error) {
          throw new Error(matchDifferenceData.error);
        }

        const matchDifference = matchDifferenceData.matchDifference;

        if (matchDifference === 0) {
          await this.notificationError("Match is happening now!");
          clearInterval(intervalId);
          return;
        } else if (matchDifference < 0) {
          await this.notificationError("Match already happened");
          clearInterval(intervalId);
          return;
        }

        if (matchDifference <= this.numberOfEventsBefore) {
          await this.completeNotification();
          clearInterval(intervalId);
          return;
        }
      } catch (e) {
        console.log(e);
        await this.notificationError("Error fetching match difference");
        clearInterval(intervalId);
        return;
      }
    }

    const intervalId = setInterval(intervalFunction, 1000 * 60 * 2);

    await intervalFunction();

    return intervalId;
  }
}

let currentIntervalId: ReturnType<typeof setInterval> | null = null;

const messageEvent = () => {
  self.addEventListener('message', async (e) => {
    // @ts-ignore
    e.waitUntil((async () => {
      if (e.data.type === 'push') {
        if (currentIntervalId) {
          clearInterval(currentIntervalId);
        }

        const pushNotification = new PushNotification(e.data.event, e.data.numberOfEventsBefore);

        currentIntervalId = await pushNotification.checkMatchDifferenceLoop();
      }
    })());
  });
};

messageEvent();