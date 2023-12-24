// @ts-nocheck
'use client'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup} from "react-simple-maps"
import {useState} from "react";
import useSWR from "swr";
import {Event} from "@/app/types";
import Link from "next/link";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then(res => res.json())

export const revalidate = 3600

export default function EventsMap() {

  const {data: eventsData, error: eventsError, isLoading: eventsLoading} = useSWR('/api/events/active', fetcher)

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
                  <circle r={markerSize * 5} fill="#FFFFFF" strokeWidth={0} className="animate-ping pointer-events-none"/>
                </Marker>
              </>
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>
      <div className="fixed sm:bottom-32 bottom-6 flex justify-center w-full">
        <div className="bg-black bg-opacity-50 p-3 rounded-lg m-4">
          {currentEvent ?
            <>
              <Link href={`/events/${currentEvent.sku}`}>
                <h1 className="sm:text-2xl text-base font-bold text-white hover:text-blue-500">{(currentEvent.name).slice(0, 40)}...</h1>
              </Link>
              <p className="text-white sm:texl-lg text-xs"><strong>Location:</strong> {currentEvent.location.city ? currentEvent.location.city + ", " : ""}{currentEvent.location.region ? currentEvent.location.region + ", ": ""}{currentEvent.location.country}</p>
              <p className="text-white sm:texl-lg text-xs"><strong>SKU:</strong> {currentEvent.sku}</p>
              <p className="text-white sm:texl-lg text-xs"><strong>Date:</strong> {formatDate(currentEvent.start)} - {formatDate(currentEvent.end)}</p>
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