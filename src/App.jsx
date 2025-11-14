import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Images
import pfp from './images/pfp1-original.mp4';
import view from './images/viewW.svg';
import discord from './images/discord.png';
import telegram from './images/telegram.png';
import vk from './images/vk.png';
import animedia from './images/animedia.png';
import yandex from './images/yandex.png';

// Videos
import videoMobile from './videos/telefon-small.mp4';
import videoDesktop from './videos/comp-small.mp4';

function App() {
  const [viewCount, setViewCount] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const [entered, setEntered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [videoVolume, setVideoVolume] = useState(0.5);
  const [isVideoMinimized, setIsVideoMinimized] = useState(false);

  // Typewriter config
  const BIO_TEXT = 'Меньше чем три<3';
  const TYPE_DURATION = 6000; // 6 seconds
  const [bioIndex, setBioIndex] = useState(0);
  const [bio, setBio] = useState('');
  const [startTyping, setStartTyping] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);

  const videoRef = useRef(null);
  const [videoPreloaded, setVideoPreloaded] = useState(false);

  // Preload background video
  useEffect(() => {
    const videoSrc = isMobile ? videoMobile : videoDesktop;
    const video = document.createElement('video');
    video.src = videoSrc;
    video.preload = 'auto';
    video.muted = true;
    
    video.onloadeddata = () => {
      setVideoPreloaded(true);
      if (videoRef.current && videoRef.current.src !== videoSrc) {
        videoRef.current.src = videoSrc;
        videoRef.current.load();
      }
    };
    
    return () => {
      video.onloadeddata = null;
    };
  }, [isMobile, videoMobile, videoDesktop]);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animate view count from 0 to 1488 over 6 seconds with easing
  useEffect(() => {
    if (!entered) return;
    
    const targetCount = 1488;
    const duration = 6000; // 6 seconds
    const startTime = Date.now();
    
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      
      const currentCount = Math.floor(easedProgress * targetCount);
      setViewCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setViewCount(targetCount);
      }
    };
    
    requestAnimationFrame(animate);
  }, [entered]);

  // Typewriter effect (one-time, 6 seconds, no erase)
  useEffect(() => {
    if (!startTyping || typingComplete) return;

    const totalChars = BIO_TEXT.length;
    const charDuration = TYPE_DURATION / totalChars;
    
    const interval = setInterval(() => {
      setBioIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= totalChars) {
          setTypingComplete(true);
          clearInterval(interval);
          return totalChars;
        }
        return nextIndex;
      });
    }, charDuration);

    return () => clearInterval(interval);
  }, [startTyping, typingComplete]);

  // Update bio text
  useEffect(() => {
    setBio(BIO_TEXT.slice(0, bioIndex));
  }, [bioIndex]);

  const handleOverlayClick = () => {
    setShowOverlay(false);
    setEntered(true);
    setStartTyping(true);

    const vid = videoRef.current;
    if (vid) {
      vid.volume = videoVolume;
      vid.muted = false;
      setVideoMuted(false);
      const playPromise = vid.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    }
  };

  // Initialize and start playback once overlay is dismissed (fallback)
  useEffect(() => {
    if (!entered) return;

    const vid = videoRef.current;
    if (!vid) return;

    const startPlayback = () => {
      vid.volume = videoVolume;
      vid.muted = false;
      setVideoMuted(false);
      const playPromise = vid.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    };

    if (vid.readyState >= 2) {
      startPlayback();
      return;
    }

    const handleLoaded = () => {
      startPlayback();
      vid.removeEventListener('loadeddata', handleLoaded);
      vid.removeEventListener('canplaythrough', handleLoaded);
    };

    vid.addEventListener('loadeddata', handleLoaded);
    vid.addEventListener('canplaythrough', handleLoaded);

    return () => {
      vid.removeEventListener('loadeddata', handleLoaded);
      vid.removeEventListener('canplaythrough', handleLoaded);
    };
  }, [entered, isMobile]);

  const toggleMute = () => {
    const vid = videoRef.current;
    if (vid) {
      vid.muted = !vid.muted;
      setVideoMuted(vid.muted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVideoVolume(newVolume);
    const vid = videoRef.current;
    if (vid) {
      vid.volume = newVolume;
      if (newVolume === 0) {
        vid.muted = true;
        setVideoMuted(true);
      } else if (vid.muted) {
        vid.muted = false;
        setVideoMuted(false);
      }
    }
  };

  const toggleMinimize = () => {
    setIsVideoMinimized(!isVideoMinimized);
  };

  return (
    <div className='app-container'>
      {showOverlay && (
        <div className='overlay' onClick={handleOverlayClick}>
          <div className='overlay-content'>
            <p className='click'>Нажмите, чтобы продолжить</p>
          </div>
        </div>
      )}

      <div className={`main-content ${entered ? 'entered' : ''}`}>
        {/* Header Section */}
        <header className='header'>
          <div className='views-badge'>
            <img src={view} className='view-icon' alt='View Icon' />
            <span className='view-count'>{viewCount}</span>
          </div>
        </header>

        {/* Profile Section */}
        <section className='profile-section'>
          <div className='profile-card'>
            <div className='profile-avatar'>
              <video 
                src={pfp} 
                className='pfp' 
                alt='Profile Picture' 
                autoPlay 
                loop 
                muted 
                playsInline
              />
            </div>
            <div className='profile-info'>
              <h1 className='profile-name'>Jumarf</h1>
              <h2 className='profile-bio'>{bio}</h2>
            </div>
          </div>
        </section>

        {/* Social Links Section */}
        <section className='social-section'>
          <h3 className='section-title'>Социальные сети</h3>
          <div className='social-grid'>
            <a href='https://t.me/Jumarfik' target='_blank' rel='noopener noreferrer' className='social-link'>
              <img src={telegram} alt='Telegram' />
              <span>Telegram</span>
            </a>
            <a href='https://vk.com/ijumarf' target='_blank' rel='noopener noreferrer' className='social-link'>
              <img src={vk} alt='VK' />
              <span>VK</span>
            </a>
            <a href='https://amedia.online' target='_blank' rel='noopener noreferrer' className='social-link'>
              <img src={animedia} alt='AniMedia' />
              <span>AniMedia</span>
            </a>
            <a
              href='https://music.yandex.ru/playlists/lk.59b2c22d-e2a8-45c8-a743-549ed9329896?utm_source=web&utm_medium=copy_link'
              target='_blank'
              rel='noopener noreferrer'
              className='social-link'
            >
              <img src={yandex} alt='Yandex Music' />
              <span>Yandex Music</span>
            </a>
            <a href='https://discord.com/users/1394584725926187069' target='_blank' rel='noopener noreferrer' className='social-link'>
              <img src={discord} alt='Discord' />
              <span>Discord</span>
            </a>
          </div>
        </section>

        {/* Content Section */}
        <section className='content-section'>
          <h3 className='section-title'>Рекомендации</h3>
          <div className='content-grid'>
            <a
              className='content-card'
              href='https://amedia.online/2007-povelitel-tajn-kloun.html'
              target='_blank'
              rel='noopener noreferrer'
            >
              <div className='content-card-inner'>
                <h4>Best Anime</h4>
                <p>Повелитель тайн: Клоун</p>
              </div>
            </a>

            <a
              className='content-card'
              href='https://amedia.online/1489-protivostojanie-svjatogo.html'
              target='_blank'
              rel='noopener noreferrer'
            >
              <div className='content-card-inner'>
                <h4>Best Donghua</h4>
                <p>Противостояние святого</p>
              </div>
            </a>
          </div>
        </section>
      </div>

      {/* Video Player (bottom-left corner) */}
      {videoPreloaded && (
        <div
          className={`video-player ${entered ? 'visible' : 'hidden'} ${isVideoMinimized ? 'minimized' : ''} ${isMobile ? 'mobile' : ''}`}
        >
          <div className='video-controls'>
            <button className='control-btn' onClick={toggleMute} title={videoMuted ? 'Включить звук' : 'Выключить звук'}>
              {videoMuted ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                  <line x1="23" y1="9" x2="17" y2="15"/>
                  <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                </svg>
              )}
            </button>
            <div className='volume-control'>
              <input
                type='range'
                min='0'
                max='1'
                step='0.01'
                value={videoVolume}
                onChange={handleVolumeChange}
                className='volume-slider'
                style={{
                  background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${videoVolume * 100}%, rgba(255, 255, 255, 0.2) ${videoVolume * 100}%, rgba(255, 255, 255, 0.2) 100%)`
                }}
                title={`Громкость: ${Math.round(videoVolume * 100)}%`}
              />
              <span className='volume-label'>{Math.round(videoVolume * 100)}%</span>
            </div>
            <button className='control-btn' onClick={toggleMinimize} title={isVideoMinimized ? 'Развернуть' : 'Свернуть'}>
              {isVideoMinimized ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 3 21 3 21 9"/>
                  <polyline points="9 21 3 21 3 15"/>
                  <line x1="21" y1="3" x2="14" y2="10"/>
                  <line x1="3" y1="21" x2="10" y2="14"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="4 14 10 14 10 20"/>
                  <polyline points="20 10 14 10 14 4"/>
                  <line x1="14" y1="10" x2="21" y2="3"/>
                  <line x1="3" y1="21" x2="10" y2="14"/>
                </svg>
              )}
            </button>
          </div>
          <video
            ref={videoRef}
            loop
            playsInline
            className='video-element'
            preload='auto'
            controls={false}
            disablePictureInPicture={true}
            controlsList="nodownload nofullscreen"
          >
            <source src={isMobile ? videoMobile : videoDesktop} type="video/mp4" />
            Ваш браузер не поддерживает тег video.
          </video>
        </div>
      )}
    </div>
  );
}

export default App;
