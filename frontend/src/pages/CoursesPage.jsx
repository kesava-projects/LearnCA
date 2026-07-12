import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, BookOpen, Clock, ChevronRight, GraduationCap } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

// Map each subject to an icon + color theme
const SUBJECT_META = {
  FR:           { icon: '📊', color: '#7c3aed' },
  SFM:          { icon: '💹', color: '#4f46e5' },
  Audit:        { icon: '🔍', color: '#06b6d4' },
  'Direct Tax': { icon: '🏛️', color: '#059669' },
  'GST & Customs': { icon: '📋', color: '#d97706' },
  Costing:      { icon: '⚖️', color: '#db2777' },
};

const getSubjectMeta = (subject) =>
  SUBJECT_META[subject] || { icon: '📘', color: '#7c3aed' };

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses');
        setCourses(data.courses);
      } catch (err) {
        toast.error('Failed to load courses. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const totalVideos = courses.reduce((sum, c) => sum + (c.videos?.length || 0), 0);

  return (
    <>
      <Navbar />
      <main className="courses-page">
        <div className="container">
          {/* ── Hero ── */}
          <div className="courses-hero">
            <h1>
              Your <span className="gradient-text">CA Final</span><br />
              Video Lectures
            </h1>
            <p>
              Expert-crafted video lectures covering all papers. Study at your own pace,
              on your own schedule.
            </p>

            <div className="courses-stats">
              <div className="stat-item">
                <div className="stat-number">{courses.length}</div>
                <div className="stat-label">Subjects</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{totalVideos}+</div>
                <div className="stat-label">Videos</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">CA</div>
                <div className="stat-label">Final Level</div>
              </div>
            </div>
          </div>

          {/* ── Grid ── */}
          {loading ? (
            <div className="loading-screen" style={{ minHeight: 'auto', paddingTop: 80 }}>
              <div className="spinner" />
              <p>Loading your courses…</p>
            </div>
          ) : courses.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '60px 0' }}>
              <GraduationCap size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
              <p>No courses available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => {
                const meta = getSubjectMeta(course.subject);
                return (
                  <div
                    key={course._id}
                    className="course-card"
                    onClick={() => navigate(`/courses/${course._id}`)}
                    role="button"
                    tabIndex={0}
                    id={`course-card-${course._id}`}
                    onKeyDown={(e) => e.key === 'Enter' && navigate(`/courses/${course._id}`)}
                    aria-label={`Open ${course.title}`}
                  >
                    <div className="course-thumbnail">
                      <div className="course-thumb-icon">{meta.icon}</div>
                      <div className="subject-badge">{course.subject}</div>
                    </div>

                    <div className="course-body">
                      <h2 className="course-title">{course.title}</h2>
                      <p className="course-desc">{course.description}</p>

                      <div className="course-meta">
                        <div className="course-videos-count">
                          <PlayCircle size={14} />
                          {course.videos?.length || 0}{' '}
                          {course.videos?.length === 1 ? 'Video' : 'Videos'}
                          {course.instructor && (
                            <span style={{ marginLeft: 8, color: 'var(--text-muted)' }}>
                              · {course.instructor}
                            </span>
                          )}
                        </div>
                        <div className="course-arrow">
                          <ChevronRight size={16} color="white" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default CoursesPage;
