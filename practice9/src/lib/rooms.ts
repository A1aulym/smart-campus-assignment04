import type { Room } from "@/lib/types";

export const CURRENT_TIME = 540;

export const ROOMS: Room[] = [
  {
    id: "b-204",
    name: "B-204 · Engineering Block",
    capacity: 30,
    equipment: ["projector", "whiteboard"],
    blocked: false,
    currentTime: CURRENT_TIME,
    bookings: [{ start: 600, end: 660, label: "Calculus 101" }],
  },
  {
    id: "a-101",
    name: "A-101 · Lecture Hall",
    capacity: 100,
    equipment: ["projector", "microphone", "whiteboard"],
    blocked: false,
    currentTime: CURRENT_TIME,
    bookings: [
      { start: 540, end: 600, label: "Physics 201" },
      { start: 700, end: 760, label: "Chemistry 110" },
    ],
  },
  {
    id: "c-310",
    name: "C-310 · Seminar Room",
    capacity: 12,
    equipment: ["whiteboard"],
    blocked: true,
    currentTime: CURRENT_TIME,
    bookings: [{ start: 550, end: 570, label: "Maintenance review" }],
  },
  {
    id: "d-105",
    name: "D-105 · Computer Lab",
    capacity: 20,
    equipment: ["projector", "computers", "lab-kit"],
    blocked: false,
    currentTime: CURRENT_TIME,
    bookings: [{ start: 660, end: 720, label: "Coding workshop" }],
  },
  {
    id: "e-202",
    name: "E-202 · Study Room",
    capacity: 6,
    equipment: ["whiteboard", "tv"],
    blocked: false,
    currentTime: CURRENT_TIME,
    bookings: [],
  },
];

export const ALL_EQUIPMENT: string[] = (() => {
  const set = new Set<string>();
  for (const room of ROOMS) {
    for (const item of room.equipment) set.add(item);
  }
  return [...set].sort();
})();
