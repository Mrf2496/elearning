export interface LibraryMedia {
  name: string;
  url: string;
}

export const libraryAudio: LibraryMedia[] = [
  {
    name: "Tono de éxito",
    url: "https://archive.org/download/Short_Success_Or_Fail_Music_01/Short_Success_Or_Fail_Music_01.mp3",
  },
  {
    name: "Música de ascensor",
    url: "https://archive.org/download/elevator-music-good-day/elevator-music-good-day.mp3",
  },
];

export const libraryVideo: LibraryMedia[] = [
  {
    name: "Popeye for President (Dominio Público)",
    url: "https://archive.org/download/popeye_for_president/popeye_for_president_512kb.mp4",
  },
  {
    name: "Viaje a la luna (Dominio Público)",
    url: "https://archive.org/download/trip-to-the-moon/trip-to-the-moon.mp4"
  }
];
