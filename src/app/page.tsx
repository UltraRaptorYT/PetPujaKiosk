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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaHome } from "react-icons/fa";

export default function PetKiosk() {
  const [iframeURL, setIframeURL] = useState<string>("");
  const commonMargin = "mt-14";
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

  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);

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

  const details = [
    {
      name: "Pet Portraiture Booth",
      image: "/portrait.png",
    },
    {
      name: "Blessings by Venerables",
      image: "/blessing.png",
    },
    {
      name: "Pet Mingling Session",
      image: "/mingling.png",
    },
    {
      name: "Pet Refuge Certificates",
      image: "/refuge.png",
    },
  ];

  const goToPet = () => setStep(1);
  const goToEvents = () => setStep(2);
  const goToHome = () => setStep(0);

  const handleButton = (link: string) => {
    if (link == "/EVENT") {
      return goToEvents();
    } else if (link == "/PET") {
      return goToPet();
    } else {
      setStep(3);
      return setIframeURL(link);
    }
  };

  const handleRegistration = () => setStep(4);

  if (!config) {
    return (
      <div className="flex items-center justify-center fullHeight text-2xl text-black">
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
            <h1 className="font-berthold text-8xl tracking-tight text-[#2f0f4b] mt-26">
              BWM PET BLESSING PUJA
            </h1>
            <div className="flex gap-8 items-center mt-16">
              {details.map((detail, i) => {
                return (
                  <div
                    className="flex flex-col gap-3 max-w-[250px] relative"
                    key={"Details" + i}
                  >
                    <p className="text-xl max-w-[175px] mx-auto font-medium leading-none">
                      {detail.name}
                    </p>
                    <div className="w-full p-1 bg-white border-[#94b143] border-3 rounded-full">
                      <Image
                        src={detail.image}
                        width={1000}
                        height={1000}
                        alt={detail.name}
                        className="object-cover object-center rounded-full border-[#94b143] border-3"
                      />
                    </div>
                    {i == details.length - 1 && (
                      <div
                        className={cn(
                          "absolute top-full w-[175px] left-1/2 -translate-x-1/2 font-medium text-xl leading-none",
                          commonMargin
                        )}
                      >
                        and Pet Blessing Tablets for deceased pets too!
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div
              className={cn(
                "flex gap-5 justify-center items-center w-full",
                commonMargin
              )}
            >
              <Button
                className="font-hortensia text-5xl px-8 pt-10 pb-8 bg-[#f8f8f8] text-black rounded-full hover:bg-gray-300"
                onClick={handleRegistration}
              >
                Register your interest
              </Button>
            </div>
            <div className="flex gap-12 justify-center items-center mt-12">
              {buttons.map((button, i) => {
                return (
                  <Button
                    key={"Button" + i}
                    onClick={() => handleButton(button.link)}
                    className="px-12 w-[250px] font-bold whitespace-normal py-12 text-2xl bg-[#edebeb] text-[#544030] rounded-[100%] hover:bg-[#bdbbbb]"
                  >
                    {button.name}
                  </Button>
                );
              })}
            </div>
            <Image
              src="/pets.png"
              width={1920}
              height={1080}
              alt={"BWM Logo"}
              className="absolute bottom-0 z-[-1] left-1/2 -translate-x-1/2 w-3/5"
            />
          </div>
        )}

        {step === 1 && (
          <div className="absolute inset-0 flex flex-col items-center">
            <h1 className="font-berthold text-8xl tracking-tight text-[#2f0f4b] mt-26">
              OUR PAST PET PUJAS
            </h1>
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={goToHome}
              className="px-4 py-5 text-black absolute top-15 left-15"
            >
              <FaHome className="size-10" />
            </Button>

            <div className="flex gap-24 justify-center pointer-events-none scale-[0.8] origin-top mt-8 relative">
              {/* TikTok Embed */}
              <blockquote
                className="tiktok-embed"
                cite="https://www.tiktok.com/@bwmonasterysg/video/7259968288392858898"
                data-video-id="7259968288392858898"
                style={{ minWidth: "325px" }}
              >
                <section>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    title="@bwmonasterysg"
                    href="https://www.tiktok.com/@bwmonasterysg?refer=embed"
                  >
                    @bwmonasterysg
                  </a>{" "}
                  No comments…. 😅😅{" "}
                  <a
                    title="bwmonastery"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.tiktok.com/tag/bwmonastery?refer=embed"
                  >
                    #bwmonastery
                  </a>{" "}
                  <a
                    title="singapore"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.tiktok.com/tag/singapore?refer=embed"
                  >
                    #singapore
                  </a>{" "}
                  <a
                    title="bwmsg"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.tiktok.com/tag/bwmsg?refer=embed"
                  >
                    #bwmsg
                  </a>{" "}
                  <a
                    title="frogmascot"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.tiktok.com/tag/frogmascot?refer=embed"
                  >
                    #frogmascot
                  </a>{" "}
                  <a
                    title="refugetaking"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.tiktok.com/tag/refugetaking?refer=embed"
                  >
                    #refugetaking
                  </a>{" "}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    title="♬ som original - letra & dança"
                    href="https://www.tiktok.com/music/som-original-6983084594799528710?refer=embed"
                  >
                    ♬ som original - letra & dança
                  </a>
                </section>
              </blockquote>

              {/* Instagram Embed #1 */}
              <blockquote
                className="instagram-media"
                data-instgrm-captioned
                data-instgrm-permalink="https://www.instagram.com/p/DGsbEtrTezL/?utm_source=ig_embed&amp;utm_campaign=loading"
                data-instgrm-version="14"
                style={{
                  background: "#FFF",
                  border: 0,
                  borderRadius: "3px",
                  boxShadow:
                    "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
                  margin: "1px",
                  maxWidth: "540px",
                  minWidth: "326px",
                  padding: 0,
                  width: "calc(100% - 2px)",
                }}
              ></blockquote>

              {/* Instagram Embed #2 */}
              <blockquote
                className="instagram-media"
                data-instgrm-captioned
                data-instgrm-permalink="https://www.instagram.com/p/C-Ri-lAyEE4/?utm_source=ig_embed&amp;utm_campaign=loading"
                data-instgrm-version="14"
                style={{
                  background: "#FFF",
                  border: 0,
                  borderRadius: "3px",
                  boxShadow:
                    "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
                  margin: "1px",
                  maxWidth: "540px",
                  minWidth: "326px",
                  padding: 0,
                  width: "calc(100% - 2px)",
                }}
              ></blockquote>
            </div>

            <div className="absolute bottom-20">
              <Button
                className="font-hortensia text-4xl px-8 pt-10 pb-8 bg-[#f8f8f8] text-black rounded-full hover:bg-gray-300"
                onClick={handleRegistration}
              >
                Register your interest
              </Button>
            </div>

            <div className="absolute right-20 bottom-5">
              <p className="font-bold text-left">Follow us on:</p>
              <div className="flex justify-center gap-5 items-center">
                <Image
                  src="/instagram.png"
                  alt={"@BWMONASTERYSG"}
                  width={1000}
                  height={1000}
                  className="h-40 w-40"
                />
                <Image
                  src="/telegram.png"
                  alt={"@ZENPAWRENTING"}
                  width={1000}
                  height={1000}
                  className="h-40 w-40"
                />
              </div>
            </div>

            <script async src="//www.instagram.com/embed.js"></script>
            <script async src="https://www.tiktok.com/embed.js"></script>
          </div>
        )}

        {step === 2 && (
          <div className="absolute inset-0 flex flex-col items-center">
            <h1 className="font-berthold text-8xl tracking-tight text-[#2f0f4b] mt-26">
              OUR PAST PET PUJAS
            </h1>
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={goToHome}
              className="px-4 py-5 text-black absolute top-15 left-15"
            >
              <FaHome className="size-10" />
            </Button>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-4 w-full p-24">
              {events.map((event, i) => (
                <div
                  key={"Event" + i}
                  className="bg-white text-black rounded-lg shadow-lg p-4 flex flex-col items-center"
                >
                  <div className="relative w-full aspect-[3/4] mb-4">
                    <Image
                      src={event.image || "/background.png"}
                      alt={event.name}
                      fill
                      className="object-cover rounded-md object-center"
                    />
                  </div>

                  <div className="mt-auto">
                    <h3 className="text-lg font-semibold">{event.name}</h3>
                    <p className="text-sm text-gray-600">
                      Venue: {event.venue}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Date & Time: {event.date}
                    </p>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="mt-auto px-4 py-5 text-xl bg-blue-600 text-white rounded-full hover:bg-blue-700">
                        Sign Up
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-center text-3xl">
                          Scan the QR Code
                        </DialogTitle>
                        <Image
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${event.link}`}
                          width={300}
                          height={300}
                          alt={event.link}
                          className="mx-auto py-5"
                        />
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={goToHome}
              className="px-4 py-5 text-black absolute top-15 left-15"
            >
              <FaHome className="size-10" />
            </Button>
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSc66cge1Lj5qgsujPJG2Jp-Qil3ShyJpf3LP8Bc8wMtAhnc2Q/viewform?embedded=true"
              width="750"
              height="900"
            >
              Loading…
            </iframe>
          </div>
        )}

        {step === 3 && (
          <div>
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={goToHome}
              className="px-4 py-5 text-black absolute top-15 left-15"
            >
              <FaHome className="size-10" />
            </Button>
            <iframe src={iframeURL} width={1488} height={837}></iframe>
          </div>
        )}
      </div>
    </div>
  );
}
