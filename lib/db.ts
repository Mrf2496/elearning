import { getEmbedUrl } from './utils';

// Data moved from App.tsx to fix permission errors by serving media links directly.
// This avoids hitting Firestore for media, which was causing permission denied errors.
const mediaData = [
    { id: '1-1', video: 'https://youtu.be/AMxkW8JEUs0', audio: 'https://drive.google.com/file/d/1SKXmmMwUeFblQCODQPtvuV8_UFgABMEc/view?usp=drive_link' },
    { id: '1-2', video: 'https://youtu.be/IqwTzGkwI0k', audio: 'https://drive.google.com/file/d/1ATYc37TjZB_F9ZVOOcV_l40JhBP6w22d/view?usp=drive_link' },
    { id: '1-3', video: 'https://youtu.be/LsGZrjfRklI', audio: 'https://drive.google.com/file/d/1A_mEIhQLEcbiGqNq7Bn-0AJmxAzwgh3h/view?usp=drive_link' },
    { id: '2-1', video: 'https://www.youtube.com/watch?v=JMf38t2N33w', audio: 'https://drive.google.com/file/d/1SKXmmMwUeFblQCODQPtvuV8_UFgABMEc/view?usp=drive_link' },
    { id: '2-2', video: 'https://youtu.be/HmMwclPwR10', audio: 'https://drive.google.com/file/d/1XlHvsAVzeJTcjbFdDQcrlpLOWWLmgKkS/view?usp=drive_link' },
    { id: '2-3', video: 'https://youtu.be/142l4LB4Qvk', audio: 'https://drive.google.com/file/d/1-daYLdD0iKoBVfYS3o8BcAxXE5br7J05/view?usp=drive_link' },
    { id: '3-1', video: 'https://youtu.be/-COAYNoCODo', audio: 'https://drive.google.com/file/d/1ffmhAPnh-eI2vxVD68jfnj8Ji14WZ0eE/view?usp=drive_link' },
    { id: '3-2', video: null, audio: 'https://drive.google.com/file/d/1NqWChl3g4YBFLxi7wFLIYyubezolfdBE/view?usp=drive_link' },
    { id: '3-3', video: null, audio: 'https://drive.google.com/file/d/1iHgfncK7Ta3sWg0Zkdon9_3MKJ72uk0J/view?usp=drive_link' },
    { id: '4-1', video: 'https://youtu.be/UaNFEck4Fpg', audio: 'https://drive.google.com/file/d/16vz5FnJUIDPCPLFNfs4aJfGS3ETv211T/view?usp=drive_link' },
    { id: '4-2', video: null, audio: 'https://drive.google.com/file/d/1piIogBJO95n7fSQprJdYYMrWZ0rZ9L2a/view?usp=drive_link' },
    { id: '4-3', video: null, audio: 'https://drive.google.com/file/d/1_BJtsAWHQnQ0mHFkJ8L15FI1SzIt6GyJ/view?usp=drive_link' },
    { id: '5-1', video: 'https://youtu.be/v9t5uYyqJ_I', audio: 'https://drive.google.com/file/d/1QcKGOfWi-G7Sz8ztEHunnLyOFhjXBk6Q/view?usp=drive_link' },
    { id: '5-2', video: null, audio: 'https://drive.google.com/file/d/1o-rCpIzMy6Jn2I7JjOQbj39AnUuokg9z/view?usp=drive_link' },
    { id: '5-3', video: null, audio: 'https://drive.google.com/file/d/19Lu4lf3_I_WKlZp6PZlGdogQ7WApgxaf/view?usp=drive_link' },
    { id: '5-4', video: null, audio: 'https://drive.google.com/file/d/1c70XJ1jR52dkHGZGCSOy7ue5yxpDTz77/view?usp=drive_link' },
    { id: '6-1', video: 'https://youtu.be/Nq66Wwm-wZ4', audio: 'https://drive.google.com/file/d/1InU7t6zvh7N6R4yDfzgCTpuJU0aA2Uwd/view?usp=drive_link' },
    { id: '6-2', video: null, audio: 'https://drive.google.com/file/d/1Tn_ZgdsnLVFfAvVkO07XJ1iZWBFfn-sL/view?usp=drive_link' },
    { id: '6-3', video: null, audio: 'https://drive.google.com/file/d/1Rq5rPXHK73WsWbWjnP8tq5WwvLGdd_WD/view?usp=drive_link' },
    { id: '7-1', video: 'https://youtu.be/PvonOTKijfg', audio: 'https://drive.google.com/file/d/1_M8FwRPPX3lHN41QCLKNvW_Is8k6G2Av/view?usp=drive_link' },
    { id: '7-2', video: null, audio: 'https://drive.google.com/file/d/1Ff-RaR0SgQw2gdVtkFkdClxmGuvdThvz/view?usp=drive_link' },
    { id: '7-3', video: null, audio: 'https://drive.google.com/file/d/14186PqZlwVsa4_3uNeFzipEmwagVMU78/view?usp=drive_link' },
    { id: '8-1', video: 'https://youtu.be/qmKihXWchb8', audio: 'https://drive.google.com/file/d/13pVMncJ2J33nv7HAm1XJR0H9iFcN3kin/view?usp=drive_link' },
    { id: '8-2', video: null, audio: 'https://drive.google.com/file/d/1aPnrc3lik9cbqwqK26_jgi_MuFF1RW1C/view?usp=drive_link' },
    { id: '8-3', video: null, audio: 'https://drive.google.com/file/d/1R_BfvWsVuS1XWl8_K0nnnlR_UUfqfkNe/view?usp=drive_link' },
    { id: '9-1', video: 'https://youtu.be/Pi8ab-yB7IA', audio: 'https://drive.google.com/file/d/1if2XwB2X-TAQsp_zRpWZMwQgWP1A2Oz0/view?usp=drive_link' },
    { id: '9-2', video: null, audio: 'https://drive.google.com/file/d/1Mz8CH6g-WEQTCP5rWarP995iRgkaJQTr/view?usp=drive_link' },
    { id: '9-3', video: null, audio: 'https://drive.google.com/file/d/1iEtDJSy-dAJa_ny7rj4z9npCKop8A55s/view?usp=drive_link' },
    { id: '10-1', video: 'https://youtu.be/X6-eSyQu9jw', audio: 'https://drive.google.com/file/d/1r43jEqbAsEYsqGV3e9VlkMCVCcemcZVW/view?usp=drive_link' },
    { id: '10-2', video: null, audio: 'https://drive.google.com/file/d/1jcOtXht8cEs4ZZAg4b-gAG9ZrJ10zSsY/view?usp=drive_link' },
    { id: '10-3', video: null, audio: 'https://drive.google.com/file/d/1z_JEiekuSKUsc47s2ugX9eerUTE4G9D8/view?usp=drive_link' },
];

// Create a simple in-memory store after processing URLs
const mediaStore: { [key: string]: { audioUrl?: string | null, videoUrl?: string | null } } = {};
mediaData.forEach(media => {
    mediaStore[media.id] = {
        audioUrl: media.audio ? getEmbedUrl(media.audio) : null,
        videoUrl: media.video ? getEmbedUrl(media.video) : null,
    };
});

export const saveAudioUrl = async (id: string, url: string): Promise<void> => {
    // This function is now a no-op to prevent Firestore writes and permission errors.
    // The media data is hardcoded in `mediaStore`.
    return Promise.resolve();
};

export const getAudioUrl = async (id: string): Promise<string | null> => {
    // Returns the URL from the local store, avoiding a Firestore read.
    return Promise.resolve(mediaStore[id]?.audioUrl || null);
};

export const saveVideoUrl = async (id: string, url: string): Promise<void> => {
    // This function is now a no-op.
    return Promise.resolve();
};

export const getVideoUrl = async (id: string): Promise<string | null> => {
    // Returns the URL from the local store.
    return Promise.resolve(mediaStore[id]?.videoUrl || null);
};