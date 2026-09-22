import { Component, useEffect, useState } from "react";
import { href, readRoute, validateCatalog } from "./content.js";
import useContent from "./useContent.js";
import {
  Badge,
  LoadState,
  Missing,
  Sources,
  TopicLinks,
} from "./components.jsx";
import Lesson from "./Lesson.jsx";
import Review from "./Review.jsx";
import Coverage from "./Coverage.jsx";
import { MiniApp, MiniAppList } from "./MiniApps.jsx";
import InterviewQuestions from "./InterviewQuestions.jsx";
import DsaPractice from "./DsaPractice.jsx";
import { ProgressProvider } from "./ProgressContext.jsx";
function TopicRows({ topics, subject }) {
  return (
    <ol className="topic-list">
      {topics.map((topic) => (
        <li key={topic.id}>
          <a href={href(subject, "topic", topic.id)}>
            <span>{topic.title}</span>
            <Badge status={topic.contentStatus} />
          </a>
        </li>
      ))}
    </ol>
  );
}
function Curriculum({ catalog }) {
  const available = catalog.topics.filter((t) => t.lessonPath);
  return (
    <>
      <header className="page-heading">
        <p className="eyebrow">YOUR LEARNING PATH</p>
        <h1>{catalog.subject.title}</h1>
        <p>Start with the foundations. Practice each idea as you go.</p>
      </header>
      <div className="stats">
        <span>
          <strong>{catalog.chapters.length}</strong> chapters
        </span>
        <span>
          <strong>{catalog.topics.length}</strong> topics in the plan
        </span>
        <span>
          <strong>{available.length}</strong> available lesson
        </span>
      </div>
      <section className="featured">
        <div>
          <p className="eyebrow">AVAILABLE TO EXPLORE</p>
          <h2>{available[0]?.title || "Lessons are being prepared"}</h2>
          <p>
            The first sample includes explanations, practice, and a small app.
            Its prerequisite lessons are still planned.
          </p>
        </div>
        {available[0] && (
          <a
            className="button primary"
            href={href(catalog.subject.id, "topic", available[0].id)}
          >
            Open sample lesson
          </a>
        )}
      </section>
      <div className="section-heading">
        <h2>Chapters</h2>
        <span className="muted">Follow the order at your own pace</span>
      </div>
      <ol className="chapter-list">
        {catalog.chapters.map((chapter) => {
          const count = catalog.topics.filter(
            (t) => t.chapterId === chapter.id && t.lessonPath,
          ).length;
          return (
            <li key={chapter.id}>
              <a href={href(catalog.subject.id, "chapter", chapter.id)}>
                <span className="chapter-number">
                  {String(chapter.order).padStart(2, "0")}
                </span>
                <span>
                  <strong>{chapter.title}</strong>
                  <small>
                    {chapter.topicIds.length} topics ·{" "}
                    {chapter.track.replaceAll("-", " ")}
                  </small>
                </span>
                <span className="chapter-status">
                  {count ? `${count} sample available` : "Planned"}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </>
  );
}
function Chapter({ catalog, id }) {
  const chapter = catalog.chapters.find((c) => c.id === id);
  if (!chapter) return <Missing />;
  return (
    <>
      <a className="back-link" href={href(catalog.subject.id)}>
        ← All chapters
      </a>
      <header className="page-heading">
        <p className="eyebrow">CHAPTER {chapter.order}</p>
        <h1>{chapter.title}</h1>
        <p>
          {chapter.topicIds.length} topics · {chapter.level}
        </p>
      </header>
      {chapter.prerequisiteChapterIds.length > 0 && (
        <p>
          Before this chapter:{" "}
          {chapter.prerequisiteChapterIds.map((cid) => (
            <a key={cid} href={href(catalog.subject.id, "chapter", cid)}>
              {catalog.chapters.find((c) => c.id === cid)?.title}
            </a>
          ))}
        </p>
      )}
      <TopicRows
        topics={chapter.topicIds.map((tid) =>
          catalog.topics.find((t) => t.id === tid),
        )}
        subject={catalog.subject.id}
      />
      {chapter.miniAppIds.length > 0 && (
        <section className="related">
          <h2>Use these concepts</h2>
          <a href={href(catalog.subject.id, "mini-apps", chapter.id)}>
            Explore this chapter's mini apps
          </a>
        </section>
      )}
    </>
  );
}
function Topic({ catalog, id, section, sources, exampleId }) {
  const topic = catalog.topics.find((t) => t.id === id);
  if (!topic) return <Missing />;
  const chapter = catalog.chapters.find((c) => c.id === topic.chapterId);
  return (
    <>
      <a
        className="back-link"
        href={href(catalog.subject.id, "chapter", chapter.id)}
      >
        ← {chapter.title}
      </a>
      {topic.lessonPath ? (
        <Lesson
          key={topic.id}
          topic={topic}
          catalog={catalog}
          section={section}
          sources={sources}
          exampleId={exampleId}
        />
      ) : (
        <>
          <header className="page-heading">
            <Badge status={topic.contentStatus} />
            <h1>{topic.title}</h1>
          </header>
          <div className="notice">
            <h2>This lesson is planned</h2>
            <p>
              This topic is part of the syllabus. Its explanation and exercises
              have not been written yet.
            </p>
          </div>
          <h2>Prerequisites</h2>
          <TopicLinks ids={topic.prerequisiteTopicIds} catalog={catalog} />
          {topic.sourceIds?.length > 0 && (
            <Sources ids={topic.sourceIds} sources={sources} />
          )}
          {catalog.topics
            .filter((t) => t.lessonPath)
            .slice(0, 1)
            .map((t) => (
              <a
                key={t.id}
                className="button"
                href={href(catalog.subject.id, "topic", t.id)}
              >
                Explore the {t.title} sample
              </a>
            ))}
          {topic.miniAppIds.length > 0 && (
            <div className="related">
              <h2>Related mini apps</h2>
              {topic.miniAppIds.map((id) => (
                <a key={id} href={href(catalog.subject.id, "mini-app", id)}>
                  Open linked mini app
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
function Subject({ subject, route }) {
  const resource = useContent(
    `content/${subject.id}/${subject.catalogPath}`,
    validateCatalog,
  );
  const sources = useContent(`content/${subject.id}/sources.json`, (data) => {
    if (!Array.isArray(data)) throw new Error("The source list is incomplete.");
    return data;
  });
  const catalog = resource.data;
  if (!catalog || !sources.data)
    return <LoadState resource={!catalog ? resource : sources} />;
  const view = route[1] || "curriculum";
  return (
    <div className="workspace">
      <aside className="sidebar">
        <a className="subject-name" href={href(subject.id)}>
          {subject.title}
          <span>Learning path</span>
        </a>
        <nav aria-label="Subject">
          <a
            aria-current={
              view === "curriculum" || view === "chapter" || view === "topic"
                ? "page"
                : undefined
            }
            href={href(subject.id)}
          >
            Chapters
          </a>
          <a
            aria-current={view.startsWith("mini-app") ? "page" : undefined}
            href={href(subject.id, "mini-apps")}
          >
            Mini apps
          </a>
          <a
            aria-current={view === "review" ? "page" : undefined}
            href={href(subject.id, "review")}
          >
            Practice & review
          </a>
          <a
            aria-current={view === "coverage" ? "page" : undefined}
            href={href(subject.id, "coverage")}
          >
            Content coverage
          </a>
        </nav>
        <div className="sidebar-note">
          <strong>Learning takes practice.</strong>
          <p>Reading a lesson does not mark it as mastered.</p>
        </div>
      </aside>
      <main id="main" tabIndex="-1" className="main-content">
        {view === "curriculum" ? (
          <Curriculum catalog={catalog} />
        ) : view === "chapter" ? (
          <Chapter catalog={catalog} id={route[2]} />
        ) : view === "topic" ? (
          <Topic
            catalog={catalog}
            id={route[2]}
            section={route[3]}
            exampleId={route[4]}
            sources={sources.data}
          />
        ) : view === "mini-apps" ? (
          <MiniAppList
            subject={subject}
            catalog={catalog}
            chapterId={route[2]}
          />
        ) : view === "mini-app" ? (
          <MiniApp
            subject={subject}
            catalog={catalog}
            id={route[2]}
            sources={sources.data}
          />
        ) : view === "review" ? (
          <Review catalog={catalog} />
        ) : view === "interview-questions" ? (
          <InterviewQuestions subject={subject} />
        ) : view === "coverage" ? (
          <Coverage catalog={catalog} sources={sources.data} />
        ) : (
          <Missing />
        )}
      </main>
    </div>
  );
}
class ErrorBoundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="notice" role="alert">
        <h1>This page could not be shown</h1>
        <p>
          The content may be incomplete. Your saved practice stays in this
          browser.
        </p>
        <button onClick={() => window.location.reload()}>Reload the app</button>
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function App() {
  const [route, setRoute] = useState(() => readRoute(window.location.hash));
  const subjects = useContent("content/subjects.json", (value) => {
    if (
      !Array.isArray(value) ||
      !value.every(
        (s) =>
          s.id &&
          s.title &&
          s.catalogPath &&
          s.interviewQuestionsPath &&
          Array.isArray(s.miniAppPaths),
      )
    )
      throw new Error("The subject list is incomplete.");
    return value;
  });
  useEffect(() => {
    const changed = () => {
      setRoute(readRoute(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", changed);
    return () => window.removeEventListener("hashchange", changed);
  }, []);
  const subject = subjects.data?.find((s) => s.id === (route[0] || "react"));
  return (
    <ProgressProvider>
      <ErrorBoundary key={route.join("/")}>
        <a
          className="skip-link"
          href="#main"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("main")?.focus();
          }}
        >
          Skip to content
        </a>
        <header className="topbar">
          <a className="brand" href="#/">
            <span className="brand-mark">sl</span>Simple Learning
          </a>
          <nav aria-label="Main"><a href="#/subjects">Learning</a><a href="#/interview">Interview questions</a><a href="#/dsa">DSA</a></nav>
        </header>
        {!subjects.data ? (
          <LoadState resource={subjects} />
        ) : route[0] === "interview" ? (
          <main id="main" tabIndex="-1" className="main-content subjects"><InterviewQuestions subject={subjects.data.find(item => item.id === "react")} /></main>
        ) : route[0] === "dsa" ? (
          <DsaPractice route={route} />
        ) : route[0] === "subjects" ? (
          <main id="main" className="main-content subjects">
            <h1>Choose a learning path</h1>
            {subjects.data.map((s) => (
              <section className="featured" key={s.id}>
                <div>
                  <h2>{s.title}</h2>
                  <p>{s.description}</p>
                </div>
                <a className="button primary" href={href(s.id)}>
                  Open {s.title}
                </a>
              </section>
            ))}
          </main>
        ) : subject ? (
          <Subject subject={subject} route={route.length ? route : ["react"]} />
        ) : (
          <Missing />
        )}
      </ErrorBoundary>
    </ProgressProvider>
  );
}
