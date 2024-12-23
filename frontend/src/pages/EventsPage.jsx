import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../Components/Events/EventCard";
import Header from "../Components/Layout/Header";
import Loader from "../Components/Layout/Loader";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          {allEvents.length !== 0 ? (
            <div className="w-full border">
              {allEvents.map((event) => (
                <EventCard key={event._id} active={true} data={event} />
              ))}
            </div>
          ) : (
            <div className="w-full grid text-center font-bold mt-20 text-4xl">
              No Events have!
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EventsPage;
