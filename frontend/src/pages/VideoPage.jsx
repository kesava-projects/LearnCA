import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  PlayCircle,
  Clock,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

const VideoPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${courseId}`);
        setCourse(data.course);
        if (data.course.videos?.length > 0) {
          setActiveVideo(data.course.videos[0]);
        }
      } catch {
        toast.error("Course not found.");
        navigate("/courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, navigate]);

  // Build streaming URL — proxy goes through Vite to Express
  // The browser sends the cookie automatically
  const getStreamUrl = (videoId) =>
    `${API}/videos/stream/${courseId}/${videoId}`;

  const handleVideoSelect = (video) => {
    setActiveVideo(video);
    // Small delay so the src updates before play
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play().catch(() => {});
      }
    }, 50);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-screen">
          <div className="spinner" />
          <p>Loading course…</p>
        </div>
      </>
    );
  }

  if (!course) return null;

  return (
    <>
      <Navbar />
      <div className="video-page">
        {/* ── Main Video Area ── */}
        <main className="video-main">
          <button
            className="back-btn"
            onClick={() => navigate("/courses")}
            id="back-to-courses-btn"
          >
            <ArrowLeft size={16} />
            Back to Courses
          </button>

          {activeVideo ? (
            <>
              <div className="video-player-wrap">
                <video
                  ref={videoRef}
                  key={activeVideo._id}
                  controls
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  preload="metadata"
                  style={{ width: "100%", height: "100%" }}
                >
                  <source
                    src={getStreamUrl(activeVideo._id)}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="video-info">
                <h1 className="video-title">{activeVideo.title}</h1>
                {activeVideo.description && (
                  <p className="video-desc">{activeVideo.description}</p>
                )}

                <div className="video-meta-bar">
                  <div className="video-meta-item">
                    <BookOpen size={14} />
                    {course.subject}
                  </div>
                  {activeVideo.duration && (
                    <div className="video-meta-item">
                      <Clock size={14} />
                      {activeVideo.duration}
                    </div>
                  )}
                  <div
                    className="video-meta-item"
                    style={{ marginLeft: "auto" }}
                  >
                    <PlayCircle size={14} />
                    Video {activeVideo.order} of {course.videos.length}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                color: "var(--text-secondary)",
              }}
            >
              <PlayCircle
                size={48}
                style={{ margin: "0 auto 16px", opacity: 0.4 }}
              />
              <p>No videos available in this course yet.</p>
            </div>
          )}
        </main>

        {/* ── Sidebar: Video List ── */}
        <aside className="video-sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">{course.title}</h2>
            <p className="sidebar-subtitle">{course.videos.length} videos</p>
          </div>

          <div className="video-list">
            {course.videos
              .sort((a, b) => a.order - b.order)
              .map((video) => (
                <div
                  key={video._id}
                  id={`video-item-${video._id}`}
                  className={`video-list-item ${activeVideo?._id === video._id ? "active" : ""}`}
                  onClick={() => handleVideoSelect(video)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleVideoSelect(video)
                  }
                  aria-label={`Play ${video.title}`}
                  aria-current={
                    activeVideo?._id === video._id ? "true" : "false"
                  }
                >
                  <div className="video-number">{video.order}</div>
                  <div className="video-list-info">
                    <div className="video-list-title" title={video.title}>
                      {video.title}
                    </div>
                    {video.duration && (
                      <div className="video-list-duration">
                        <Clock
                          size={10}
                          style={{ display: "inline", marginRight: 4 }}
                        />
                        {video.duration}
                      </div>
                    )}
                  </div>
                  {activeVideo?._id === video._id && (
                    <PlayCircle
                      size={16}
                      color="var(--accent-1)"
                      style={{ flexShrink: 0 }}
                    />
                  )}
                </div>
              ))}
          </div>
        </aside>
      </div>
    </>
  );
};

export default VideoPage;
