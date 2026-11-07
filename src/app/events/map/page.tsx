// @ts-nocheck
'use client'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup} from "react-simple-maps"
import {useState} from "react";
import useSWR from "swr";
import {Event} from "@/app/types";
import Link from "next/link";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then(res => {
  if (res.status === 200) {
    return res.json()
  } else if (res.status === 429) {
    throw new Error("Too many requests")
  } else {
    throw new Error("Couldn't fetch data")
  }
})

const SWROptions = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
  focusThrottleInterval: 30 * 1000,
}

export default function EventsMap() {

  const {data: eventsData, error: eventsError, isLoading: eventsLoading} = useSWR('/api/events/active', fetcher, SWROptions)

  const events = eventsData?.events

  const markers = events?.map((event: Event) => {
    const eventNumDays = Math.ceil((new Date(event.end).getTime() - new Date(event.start).getTime()) / (1000 * 60 * 60 * 24))

    return {
      markerOffset: 0,
      name: event.id,
      coordinates: [event.location.coordinates.lon, event.location.coordinates.lat],
      markerSize: 0.2 * (eventNumDays + 1)
    }
  })

  const [currentEvent, setCurrentEvent] = useState<Event | null>(null)

  const setActivelyViewedEvent = (eventId: string) => {
    const event = events?.find((event: Event) => event.id === eventId)
    setCurrentEvent(event)
  }

  const formatDate = (date: string) => {
    return (new Date(date)).toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'GMT',
    })
  }

  return (
    <main>
      <div className="mapContainerWrapper">
        <ComposableMap className="w-[100vw] h-[100vh]" fill="#262626">
          <ZoomableGroup center={[0, 0]} zoom={0.9} strokeWidth={0.3} stroke={"#5D5A6D"} minZoom={1} maxZoom={400}>
            <Geographies geography="/map.json">
              {({ geographies }) => {
                return geographies.map((geo, i) => {
                  return <Geography key={geo.rsmKey + i} geography={geo} style={{ default: { fill: "#262626" } }} onClick={(e) => {e.preventDefault()}}/>
                })
              }}
            </Geographies>
            {markers?.map(({ name, coordinates, markerOffset, markerSize }, i) => {
              return <>
                <Marker key={name + i} coordinates={coordinates} onClick={() => setActivelyViewedEvent(name)} onMouseEnter={() => setActivelyViewedEvent(name)}>
                  <circle r={markerSize} fill="#FFFFFF" strokeWidth={0}/>
                  <circle r={markerSize * 5} fill="#FFFFFF" strokeWidth={0} className="pointer-events-none animate-ping"/>
                </Marker>
              </>
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>
      <div className="fixed bottom-6 flex w-full justify-center sm:bottom-32">
        <div className="m-4 rounded-lg bg-black bg-opacity-50 p-3">
          {currentEvent ?
            <>
              <Link href={`/events/${currentEvent.sku}`}>
                <h1 className="text-base font-bold text-white hover:text-blue-500 sm:text-2xl">{(currentEvent.name).slice(0, 40)}...</h1>
              </Link>
              <p className="text-xs text-white sm:texl-lg"><strong>Location:</strong> {currentEvent.location.city ? currentEvent.location.city + ", " : ""}{currentEvent.location.region ? currentEvent.location.region + ", ": ""}{currentEvent.location.country}</p>
              <p className="text-xs text-white sm:texl-lg"><strong>SKU:</strong> {currentEvent.sku}</p>
              <p className="text-xs text-white sm:texl-lg"><strong>Date:</strong> {formatDate(currentEvent.start)} - {formatDate(currentEvent.end)}</p>
            </>
            :
            <>
              <h1 className="text-2xl font-bold text-white">Live Map of Events</h1>
              <p className="text-white">Click on a circle to view the events details.</p>
            </>
          }
        </div>
      </div>
    </main>
  )
}