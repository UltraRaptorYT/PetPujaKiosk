"use client";
import { useCallback, useRef, useState, useEffect } from "react";
import {
  KioskConfig,
  ButtonConfig,
  EventConfig,
  SheetAPIResponse,
} from "@/types";
import "./index.css";
import Image from "next/image";

export default function PetKiosk() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setStep(0);
    }, 1000 * 60 * 5); // 5 minutes
  }, []);

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keydown", "touchstart"];

    const handleActivity = () => resetInactivityTimer();

    events.forEach((event) => window.addEventListener(event, handleActivity));

    resetInactivityTimer(); // Start the timer initially

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [resetInactivityTimer]);

  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  const [config, setConfig] = useState<KioskConfig | null>(null);
  const [buttons, setButtons] = useState<ButtonConfig[]>([]);
  const [events, setEvents] = useState<EventConfig[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch("/api/sheet");
      const data: SheetAPIResponse = await res.json();

      setConfig(data.config);
      setButtons(data.buttons);
      setEvents(data.events);
    };

    loadData();
  }, []);

  if (!config) {
    return (
      <div className="flex items-center justify-center fullHeight text-2xl text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full fullHeight bg-cover bg-top"
      style={{
        backgroundImage: `url('${
          config.BackgroundImage || "/background.png"
        }')`,
        backgroundColor: "#fcf2e2",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "top",
      }}
    >
      <Image
        src="/BWM Square.png"
        width={1000}
        height={1000}
        alt={"BWM Logo"}
        className="absolute top-5 right-5 w-24"
      />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] p-6 text-center text-black">
        {/* Content */}
        {step === 0 && (
          <div className="absolute inset-0 flex flex-col items-center">
            <h1 className="font-berthold text-8xl tracking-tight text-[#2f0f4b] mt-20">
              BWM PET BLESSING PUJA
            </h1>
            <div className="flex gap-3">
              <div className="flex flex-col gap-3 max-w-[175px]">
                <p className="text-xl">Pet Portraiture Booth</p>
                <Image src="" width={1000} height={1000} alt="" className="imageBorder rounded-full" />
              </div>
            </div>
            <Image
              src="/pets.png"
              width={1920}
              height={1080}
              alt={"BWM Logo"}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5"
            />
          </div>
        )}
      </div>
    </div>
  );
}
