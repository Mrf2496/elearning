
import React, { useState, useMemo, useEffect } from 'react';
import { View } from './types';
import { courseData } from './constants/courseData';
import { CourseProgressContext } from './context/CourseProgressContext';
import { useCourseProgress } from './hooks/useCourseProgress';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import CourseDashboard from './components/CourseDashboard';
import ModuleView from './components/ModuleView';
import CaseStudiesView from './components/CaseStudiesView';
import FinalQuiz from './components/FinalQuiz';
import Certificate from './components/Certificate';
import { saveVideoUrl, getVideoUrl, saveAudioUrl, getAudioUrl } from './lib/db';
import { getEmbedUrl } from './lib/utils';

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  
  const progressHook = useCourseProgress();

  // Seed the database with media on first load
  useEffect(() => {
    const seedSubmoduleMedia = async () => {
      // --- Submodule 1-1 ---
      const submoduleId_1_1 = '1-1';
      
      // Seed Video for 1-1
      const videoSeedFlag_1_1 = `seeded_video_preview_v6_${submoduleId_1_1}`;
      if (!localStorage.getItem(videoSeedFlag_1_1)) {
        try {
          const rawUrl = 'https://youtu.be/AMxkW8JEUs0';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveVideoUrl(submoduleId_1_1, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed video database for ${submoduleId_1_1}:`, error);
        } finally {
          localStorage.setItem(videoSeedFlag_1_1, 'true');
        }
      }

      // Seed Audio for 1-1
      const audioSeedFlag_1_1 = `seeded_audio_preview_v6_${submoduleId_1_1}`;
      if (!localStorage.getItem(audioSeedFlag_1_1)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1SKXmmMwUeFblQCODQPtvuV8_UFgABMEc/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_1_1, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_1_1}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_1_1, 'true');
        }
      }
      
      // --- Submodule 1-2 ---
      const submoduleId_1_2 = '1-2';

      // Seed Video for 1-2
      const videoSeedFlag_1_2 = `seeded_video_preview_v6_${submoduleId_1_2}`;
      if (!localStorage.getItem(videoSeedFlag_1_2)) {
        try {
          const rawUrl = 'https://youtu.be/IqwTzGkwI0k';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveVideoUrl(submoduleId_1_2, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed video database for ${submoduleId_1_2}:`, error);
        } finally {
          localStorage.setItem(videoSeedFlag_1_2, 'true');
        }
      }

      // Seed Audio for 1-2
      const audioSeedFlag_1_2 = `seeded_audio_preview_v6_${submoduleId_1_2}`;
      if (!localStorage.getItem(audioSeedFlag_1_2)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1ATYc37TjZB_F9ZVOOcV_l40JhBP6w22d/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_1_2, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_1_2}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_1_2, 'true');
        }
      }

      // --- Submodule 1-3 --- (User's request)
      const submoduleId_1_3 = '1-3';

      // Seed Video for 1-3
      const videoSeedFlag_1_3 = `seeded_video_preview_v6_${submoduleId_1_3}`;
      if (!localStorage.getItem(videoSeedFlag_1_3)) {
        try {
          const rawUrl = 'https://youtu.be/LsGZrjfRklI';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveVideoUrl(submoduleId_1_3, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed video database for ${submoduleId_1_3}:`, error);
        } finally {
          localStorage.setItem(videoSeedFlag_1_3, 'true');
        }
      }

      // Seed Audio for 1-3
      const audioSeedFlag_1_3 = `seeded_audio_preview_v6_${submoduleId_1_3}`;
      if (!localStorage.getItem(audioSeedFlag_1_3)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1A_mEIhQLEcbiGqNq7Bn-0AJmxAzwgh3h/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_1_3, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_1_3}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_1_3, 'true');
        }
      }

      // --- Submodule 2-1 ---
      const submoduleId_2_1 = '2-1';
      
      // Seed Video for 2-1
      const videoSeedFlag_2_1 = `seeded_video_preview_v6_${submoduleId_2_1}`;
      if (!localStorage.getItem(videoSeedFlag_2_1)) {
        try {
          const rawUrl = 'https://www.youtube.com/watch?v=JMf38t2N33w';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveVideoUrl(submoduleId_2_1, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed video database for ${submoduleId_2_1}:`, error);
        } finally {
          localStorage.setItem(videoSeedFlag_2_1, 'true');
        }
      }
      
      const audioSeedFlag_2_1 = `seeded_audio_preview_v6_${submoduleId_2_1}`;
      if (!localStorage.getItem(audioSeedFlag_2_1)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1SKXmmMwUeFblQCODQPtvuV8_UFgABMEc/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_2_1, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_2_1}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_2_1, 'true');
        }
      }

      // --- Submodule 2-2 ---
      const submoduleId_2_2 = '2-2';

      // Seed Video for 2-2
      const videoSeedFlag_2_2 = `seeded_video_preview_v6_${submoduleId_2_2}`;
      if (!localStorage.getItem(videoSeedFlag_2_2)) {
        try {
          const rawUrl = 'https://youtu.be/HmMwclPwR10';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveVideoUrl(submoduleId_2_2, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed video database for ${submoduleId_2_2}:`, error);
        } finally {
          localStorage.setItem(videoSeedFlag_2_2, 'true');
        }
      }
      
      const audioSeedFlag_2_2 = `seeded_audio_preview_v6_${submoduleId_2_2}`;
      if (!localStorage.getItem(audioSeedFlag_2_2)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1XlHvsAVzeJTcjbFdDQcrlpLOWWLmgKkS/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_2_2, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_2_2}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_2_2, 'true');
        }
      }

      // --- Submodule 2-3 ---
      const submoduleId_2_3 = '2-3';
      
      // Seed Video for 2-3
      const videoSeedFlag_2_3 = `seeded_video_preview_v6_${submoduleId_2_3}`;
      if (!localStorage.getItem(videoSeedFlag_2_3)) {
        try {
          const rawUrl = 'https://youtu.be/142l4LB4Qvk';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveVideoUrl(submoduleId_2_3, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed video database for ${submoduleId_2_3}:`, error);
        } finally {
          localStorage.setItem(videoSeedFlag_2_3, 'true');
        }
      }

      const audioSeedFlag_2_3 = `seeded_audio_preview_v6_${submoduleId_2_3}`;
      if (!localStorage.getItem(audioSeedFlag_2_3)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1-daYLdD0iKoBVfYS3o8BcAxXE5br7J05/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_2_3, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_2_3}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_2_3, 'true');
        }
      }

      // --- Submodule 3-1 ---
      const submoduleId_3_1 = '3-1';
      const audioSeedFlag_3_1 = `seeded_audio_preview_v6_${submoduleId_3_1}`;
      if (!localStorage.getItem(audioSeedFlag_3_1)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1ffmhAPnh-eI2vxVD68jfnj8Ji14WZ0eE/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_3_1, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_3_1}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_3_1, 'true');
        }
      }

      // --- Submodule 3-2 ---
      const submoduleId_3_2 = '3-2';
      const audioSeedFlag_3_2 = `seeded_audio_preview_v6_${submoduleId_3_2}`;
      if (!localStorage.getItem(audioSeedFlag_3_2)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1NqWChl3g4YBFLxi7wFLIYyubezolfdBE/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_3_2, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_3_2}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_3_2, 'true');
        }
      }

      // --- Submodule 3-3 ---
      const submoduleId_3_3 = '3-3';
      const audioSeedFlag_3_3 = `seeded_audio_preview_v6_${submoduleId_3_3}`;
      if (!localStorage.getItem(audioSeedFlag_3_3)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1iHgfncK7Ta3sWg0Zkdon9_3MKJ72uk0J/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_3_3, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_3_3}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_3_3, 'true');
        }
      }

      // --- Submodule 4-1 ---
      const submoduleId_4_1 = '4-1';
      const audioSeedFlag_4_1 = `seeded_audio_preview_v6_${submoduleId_4_1}`;
      if (!localStorage.getItem(audioSeedFlag_4_1)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/16vz5FnJUIDPCPLFNfs4aJfGS3ETv211T/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_4_1, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_4_1}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_4_1, 'true');
        }
      }

      // --- Submodule 4-2 ---
      const submoduleId_4_2 = '4-2';
      const audioSeedFlag_4_2 = `seeded_audio_preview_v6_${submoduleId_4_2}`;
      if (!localStorage.getItem(audioSeedFlag_4_2)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1piIogBJO95n7fSQprJdYYMrWZ0rZ9L2a/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_4_2, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_4_2}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_4_2, 'true');
        }
      }

      // --- Submodule 4-3 ---
      const submoduleId_4_3 = '4-3';
      const audioSeedFlag_4_3 = `seeded_audio_preview_v6_${submoduleId_4_3}`;
      if (!localStorage.getItem(audioSeedFlag_4_3)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1_BJtsAWHQnQ0mHFkJ8L15FI1SzIt6GyJ/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_4_3, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_4_3}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_4_3, 'true');
        }
      }

      // --- Submodule 5-1 ---
      const submoduleId_5_1 = '5-1';
      const audioSeedFlag_5_1 = `seeded_audio_preview_v6_${submoduleId_5_1}`;
      if (!localStorage.getItem(audioSeedFlag_5_1)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1QcKGOfWi-G7Sz8ztEHunnLyOFhjXBk6Q/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_5_1, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_5_1}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_5_1, 'true');
        }
      }

      // --- Submodule 5-2 ---
      const submoduleId_5_2 = '5-2';
      const audioSeedFlag_5_2 = `seeded_audio_preview_v6_${submoduleId_5_2}`;
      if (!localStorage.getItem(audioSeedFlag_5_2)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1o-rCpIzMy6Jn2I7JjOQbj39AnUuokg9z/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_5_2, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_5_2}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_5_2, 'true');
        }
      }

      // --- Submodule 5-3 ---
      const submoduleId_5_3 = '5-3';
      const audioSeedFlag_5_3 = `seeded_audio_preview_v6_${submoduleId_5_3}`;
      if (!localStorage.getItem(audioSeedFlag_5_3)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/19Lu4lf3_I_WKlZp6PZlGdogQ7WApgxaf/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_5_3, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_5_3}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_5_3, 'true');
        }
      }

      // --- Submodule 5-4 ---
      const submoduleId_5_4 = '5-4';
      const audioSeedFlag_5_4 = `seeded_audio_preview_v6_${submoduleId_5_4}`;
      if (!localStorage.getItem(audioSeedFlag_5_4)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1c70XJ1jR52dkHGZGCSOy7ue5yxpDTz77/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_5_4, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_5_4}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_5_4, 'true');
        }
      }

      // --- Submodule 6-1 ---
      const submoduleId_6_1 = '6-1';
      const audioSeedFlag_6_1 = `seeded_audio_preview_v6_${submoduleId_6_1}`;
      if (!localStorage.getItem(audioSeedFlag_6_1)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1InU7t6zvh7N6R4yDfzgCTpuJU0aA2Uwd/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_6_1, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_6_1}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_6_1, 'true');
        }
      }

      // --- Submodule 6-2 ---
      const submoduleId_6_2 = '6-2';
      const audioSeedFlag_6_2 = `seeded_audio_preview_v6_${submoduleId_6_2}`;
      if (!localStorage.getItem(audioSeedFlag_6_2)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1Tn_ZgdsnLVFfAvVkO07XJ1iZWBFfn-sL/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_6_2, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_6_2}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_6_2, 'true');
        }
      }

      // --- Submodule 6-3 ---
      const submoduleId_6_3 = '6-3';
      const audioSeedFlag_6_3 = `seeded_audio_preview_v6_${submoduleId_6_3}`;
      if (!localStorage.getItem(audioSeedFlag_6_3)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1Rq5rPXHK73WsWbWjnP8tq5WwvLGdd_WD/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_6_3, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_6_3}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_6_3, 'true');
        }
      }

      // --- Submodule 7-1 ---
      const submoduleId_7_1 = '7-1';
      const audioSeedFlag_7_1 = `seeded_audio_preview_v6_${submoduleId_7_1}`;
      if (!localStorage.getItem(audioSeedFlag_7_1)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1_M8FwRPPX3lHN41QCLKNvW_Is8k6G2Av/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_7_1, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_7_1}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_7_1, 'true');
        }
      }
      
      // --- Submodule 7-2 ---
      const submoduleId_7_2 = '7-2';
      const audioSeedFlag_7_2 = `seeded_audio_preview_v6_${submoduleId_7_2}`;
      if (!localStorage.getItem(audioSeedFlag_7_2)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1Ff-RaR0SgQw2gdVtkFkdClxmGuvdThvz/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_7_2, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_7_2}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_7_2, 'true');
        }
      }

      // --- Submodule 7-3 ---
      const submoduleId_7_3 = '7-3';
      const audioSeedFlag_7_3 = `seeded_audio_preview_v6_${submoduleId_7_3}`;
      if (!localStorage.getItem(audioSeedFlag_7_3)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/14186PqZlwVsa4_3uNeFzipEmwagVMU78/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_7_3, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_7_3}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_7_3, 'true');
        }
      }
      
      // --- Submodule 8-1 ---
      const submoduleId_8_1 = '8-1';
      const audioSeedFlag_8_1 = `seeded_audio_preview_v6_${submoduleId_8_1}`;
      if (!localStorage.getItem(audioSeedFlag_8_1)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/13pVMncJ2J33nv7HAm1XJR0H9iFcN3kin/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_8_1, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_8_1}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_8_1, 'true');
        }
      }

      // --- Submodule 8-2 ---
      const submoduleId_8_2 = '8-2';
      const audioSeedFlag_8_2 = `seeded_audio_preview_v6_${submoduleId_8_2}`;
      if (!localStorage.getItem(audioSeedFlag_8_2)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1aPnrc3lik9cbqwqK26_jgi_MuFF1RW1C/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_8_2, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_8_2}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_8_2, 'true');
        }
      }

      // --- Submodule 8-3 ---
      const submoduleId_8_3 = '8-3';
      const audioSeedFlag_8_3 = `seeded_audio_preview_v6_${submoduleId_8_3}`;
      if (!localStorage.getItem(audioSeedFlag_8_3)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1R_BfvWsVuS1XWl8_K0nnnlR_UUfqfkNe/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_8_3, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_8_3}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_8_3, 'true');
        }
      }

      // --- Submodule 9-1 ---
      const submoduleId_9_1 = '9-1';
      const audioSeedFlag_9_1 = `seeded_audio_preview_v6_${submoduleId_9_1}`;
      if (!localStorage.getItem(audioSeedFlag_9_1)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1if2XwB2X-TAQsp_zRpWZMwQgWP1A2Oz0/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_9_1, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_9_1}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_9_1, 'true');
        }
      }

      // --- Submodule 9-2 ---
      const submoduleId_9_2 = '9-2';
      const audioSeedFlag_9_2 = `seeded_audio_preview_v6_${submoduleId_9_2}`;
      if (!localStorage.getItem(audioSeedFlag_9_2)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1Mz8CH6g-WEQTCP5rWarP995iRgkaJQTr/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_9_2, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_9_2}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_9_2, 'true');
        }
      }

      // --- Submodule 9-3 ---
      const submoduleId_9_3 = '9-3';
      const audioSeedFlag_9_3 = `seeded_audio_preview_v6_${submoduleId_9_3}`;
      if (!localStorage.getItem(audioSeedFlag_9_3)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1iEtDJSy-dAJa_ny7rj4z9npCKop8A55s/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_9_3, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_9_3}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_9_3, 'true');
        }
      }

      // --- Submodule 10-1 ---
      const submoduleId_10_1 = '10-1';
      const audioSeedFlag_10_1 = `seeded_audio_preview_v6_${submoduleId_10_1}`;
      if (!localStorage.getItem(audioSeedFlag_10_1)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1r43jEqbAsEYsqGV3e9VlkMCVCcemcZVW/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_10_1, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_10_1}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_10_1, 'true');
        }
      }

      // --- Submodule 10-2 ---
      const submoduleId_10_2 = '10-2';
      const audioSeedFlag_10_2 = `seeded_audio_preview_v6_${submoduleId_10_2}`;
      if (!localStorage.getItem(audioSeedFlag_10_2)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1jcOtXht8cEs4ZZAg4b-gAG9ZrJ10zSsY/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_10_2, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_10_2}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_10_2, 'true');
        }
      }

      // --- Submodule 10-3 ---
      const submoduleId_10_3 = '10-3';
      const audioSeedFlag_10_3 = `seeded_audio_preview_v6_${submoduleId_10_3}`;
      if (!localStorage.getItem(audioSeedFlag_10_3)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1z_JEiekuSKUsc47s2ugX9eerUTE4G9D8/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_10_3, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_10_3}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_10_3, 'true');
        }
      }
    };

    seedSubmoduleMedia();
  }, []);


  const handleSelectModule = (moduleId: number) => {
    if (moduleId === 11) {
      setCurrentView(View.CaseStudies);
    } else {
      setSelectedModuleId(moduleId);
      setCurrentView(View.Module);
    }
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };

  const selectedModule = useMemo(() => 
    courseData.modules.find(m => m.id === selectedModuleId),
    [selectedModuleId]
  );

  const moduleIds = useMemo(() => courseData.modules.map(m => m.id), []);
  const currentModuleIndex = selectedModuleId !== null ? moduleIds.indexOf(selectedModuleId) : -1;

  const handleNextModule = () => {
    if (currentModuleIndex > -1 && currentModuleIndex < moduleIds.length - 1) {
      const nextModuleId = moduleIds[currentModuleIndex + 1];
      handleSelectModule(nextModuleId);
    }
  };

  const handlePreviousModule = () => {
    if (currentModuleIndex > 0) {
      const prevModuleId = moduleIds[currentModuleIndex - 1];
      handleSelectModule(prevModuleId);
    }
  };
  
  const renderContent = () => {
    switch(currentView) {
      case View.Module:
        return selectedModule ? (
          <ModuleView 
            module={selectedModule} 
            onModuleComplete={() => progressHook.completeModule(selectedModule.id)}
            onNavigate={handleNavigate}
            onNextModule={handleNextModule}
            onPreviousModule={handlePreviousModule}
            isFirstModule={currentModuleIndex === 0}
            isLastModule={currentModuleIndex === moduleIds.length - 1}
          />
        ) : <CourseDashboard onSelectModule={handleSelectModule} />;
      case View.CaseStudies:
        return <CaseStudiesView onComplete={() => progressHook.completeModule(11)} />;
      case View.Quiz:
        return <FinalQuiz />;
      case View.Certificate:
        return <Certificate />;
      case View.Dashboard:
      default:
        return <CourseDashboard onSelectModule={handleSelectModule} />;
    }
  }

  return (
    <CourseProgressContext.Provider value={progressHook}>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar onNavigate={handleNavigate} />
          <main className="flex-1 p-6 md:p-10 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </CourseProgressContext.Provider>
  );
}
