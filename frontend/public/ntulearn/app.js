const initialCourses = [
    {
        id: '1',
        code: 'SC3010',
        title: 'Computer Security',
        term: '2025-s2',
        favourite: true,
        instructors: ['Luiz Fernando', 'Smith John'],
        image: 'https://picsum.photos/seed/sc3010/600/300'
    },
    {
        id: '2',
        code: 'SC2002',
        title: 'Object Oriented Design and Programming',
        term: '2026-s1',
        favourite: true,
        instructors: ['Multiple Instructors'],
        image: 'https://picsum.photos/seed/sc2002/600/300'
    },
    {
        id: '3',
        code: 'SC2006',
        title: 'Software Engineering',
        term: '2026-s1',
        favourite: false,
        instructors: ['Jane Doe'],
        image: 'https://picsum.photos/seed/sc2006/600/300'
    },
    {
        id: '4',
        code: 'MH1810',
        title: 'Mathematics I',
        term: '2025-s2',
        favourite: true,
        instructors: ['Alan Turing'],
        image: 'https://picsum.photos/seed/mh1810/600/300'
    },
    {
        id: '5',
        code: 'EE2008',
        title: 'Data Structures and Algorithms',
        term: '2026-s1',
        favourite: false,
        instructors: ['Navin Kumar', 'Jane Smith'],
        image: 'https://picsum.photos/seed/ee2008/600/300'
    }
];

// Generate more placeholder courses to test pagination
let extraItems = [];
for (let i = 6; i <= 35; i++) {
    extraItems.push({
        id: String(i),
        code: `EL${1000 + i}`,
        title: `Elective Subject ${i}`,
        term: i % 2 === 0 ? '2026-s1' : '2025-s2',
        favourite: i % 5 === 0,
        instructors: ['Instructor ' + i],
        image: `https://picsum.photos/seed/el${i}/600/300`
    });
}
const allCourses = [...initialCourses, ...extraItems];

const state = {
    courses: allCourses,
    viewMode: 'grid', // 'grid' | 'list'
    searchQuery: '',
    termFilter: 'all',
    typeFilter: 'all',
    itemsPerPage: 25,
    // --- NorthStar SPA State ---
    activeTab: 'view-courses',
    sidebarExpanded: true,
    isStudyMode: false,

    // --- KHAN ACADEMY / STUDY MODE STATE ---
    todayPlan: [
        { id: 'p1', timeStart: '09:00', timeEnd: '10:00', subjectTitle: 'SC3010: Software Security', status: 'active',  subjectId: 'subj1', courseId: '1', durationMinutes: 60, blockType: 'work' },
        { id: 'pb1', timeStart: '10:00', timeEnd: '10:10', subjectTitle: 'Short Break', status: 'pending', subjectId: null, courseId: null, durationMinutes: 10, blockType: 'short_break' },
        { id: 'p2', timeStart: '10:10', timeEnd: '11:10', subjectTitle: 'SC2002: Polymorphism', status: 'pending', subjectId: null, courseId: '2', durationMinutes: 60, blockType: 'work' },
        { id: 'pb2', timeStart: '11:10', timeEnd: '11:20', subjectTitle: 'Short Break', status: 'pending', subjectId: null, courseId: null, durationMinutes: 10, blockType: 'short_break' },
        { id: 'p3', timeStart: '11:20', timeEnd: '12:20', subjectTitle: 'SC2006: Design Patterns', status: 'pending', subjectId: null, courseId: '3', durationMinutes: 60, blockType: 'work' },
    ],
    todayProgressPct: 42,
    subjects: {
        'subj1': {
            id: 'subj1',
            title: 'Non-contact interactions',
            breadcrumb: "Physics > Forces and Newton's laws of motion",
            units: [
                { id: 'u1', title: 'Motion and forces' },
                { id: 'u2', title: 'Non-contact interactions' },
                { id: 'u3', title: 'Energy' }
            ],
            lessons: [
                { id: 'l1', unitId: 'u2', type: 'video', title: 'Intro to gravity', duration: '8m', status: 'done', content: 'https://picsum.photos/seed/grav/800/450' },
                { id: 'l2', unitId: 'u2', type: 'reading', title: 'Newton\'s law of universal gravitation', duration: '10m', status: 'pending', content: 'Newton\'s law of universal gravitation states that every particle attracts every other particle in the universe with a force proportional to the product of their masses and inversely proportional to the square of the distance between their centers. \n\nFormula: F = G * (m1 * m2) / r^2' },
                { id: 'l3', unitId: 'u2', type: 'activity', title: 'Practice: Gravity interactions', duration: '15m', status: 'pending', content: 'Interactive gravity simulator (Mock).' }
            ],
            practiceCards: [
                { id: 'prac1', status: 'up-next', title: 'Gravity equations' },
                { id: 'prac2', status: 'not-started', title: 'Planetary orbits' }
            ]
        },
        'subj2': { id: 'subj2', title: 'Calculus: Optimization', breadcrumb: 'Math', units: [], lessons: [], practiceCards: [] },
        'subj3': { id: 'subj3', title: 'Data Structures: Graphs', breadcrumb: 'Computer Science', units: [], lessons: [], practiceCards: [] },
    },
    selectedSubjectId: 'subj1',
    selectedUnitId: 'u2',
    selectedLessonId: 'l2',
    quizActive: false,
    quizCurrentQuestion: 1,
    quizScore: 0,
    tags: [
        { name: 'SC2207', color: '#b48a71', badgeColor: '#b48a71' },
        { name: 'SC3010', color: '#F97316', badgeColor: '#F97316' }, // Security
        { name: 'SC2006', color: '#F97316', badgeColor: '#F97316' }, // Engineering
        { name: 'SC2002', color: '#8B5CF6', badgeColor: '#8B5CF6' }, // Programming
        { name: 'MH1810', color: '#8B5CF6', badgeColor: '#8B5CF6' }, // Math
        { name: 'HE3010', color: '#a17bc9', badgeColor: '#a17bc9' },
        { name: 'HW0288', color: '#679e78', badgeColor: '#679e78' },
        { name: 'SC2079', color: '#888888', badgeColor: '#888888' }
    ],
    currentEditTag: null,
    // --- TIMEMAP / CALENDAR STATE ---
    calendarBlocks: [
        // ── SC3010: Computer Security ──
        { id: 'c_sc3010_lec_mon', title: 'SC3010: Computer Security', day: 0, kind: 'lecture', startMin: 600, endMin: 720, code: 'LEC' }, // Mon 10–12
        { id: 'c_sc3010_tut_wed', title: 'SC3010: Computer Security', day: 2, kind: 'tutorial', startMin: 780, endMin: 840, code: 'TUT' }, // Wed 13–14
        { id: 'c_sc3010_lab_fri', title: 'SC3010: Computer Security', day: 4, kind: 'lab', startMin: 540, endMin: 660, code: 'LAB' }, // Fri 09–11

        // ── SC2002: OOP ──
        { id: 'c_sc2002_lec_mon', title: 'SC2002: OOP', day: 0, kind: 'lecture', startMin: 780, endMin: 900, code: 'LEC' }, // Mon 13–15
        { id: 'c_sc2002_tut_thu', title: 'SC2002: OOP', day: 3, kind: 'tutorial', startMin: 600, endMin: 660, code: 'TUT' }, // Thu 10–11
        { id: 'c_sc2002_lab_thu', title: 'SC2002: OOP', day: 3, kind: 'lab', startMin: 660, endMin: 780, code: 'LAB' }, // Thu 11–13

        // ── SC2006: Software Engineering ──
        { id: 'c_sc2006_lec_wed', title: 'SC2006: Software Engineering', day: 2, kind: 'lecture', startMin: 540, endMin: 660, code: 'LEC' }, // Wed 09–11
        { id: 'c_sc2006_tut_fri', title: 'SC2006: Software Engineering', day: 4, kind: 'tutorial', startMin: 720, endMin: 780, code: 'TUT' }, // Fri 12–13

        // ── Study Sessions — populated by backend (see fetchAndApplyBackendData) ──
    ]
};

function init() {
    // Check which page we are on
    const isStudyPage = document.querySelector('.ns-app') !== null;

    if (isStudyPage) {
        state.isStudyMode = false;
        state.activeTab = 'view-courses';

        // Dynamic greeting based on current time
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
        const greetingEl = document.getElementById('ns-greeting-text');
        if (greetingEl) greetingEl.textContent = `${greeting}, Janet`;

        bindNsAppEvents();
        renderNsAppCourses();

        playCinematicReveal();
    } else {
        bindEvents();
        render();
        // Also bind the toggle button to go to study mode
        const toggleBtn = document.getElementById('ns-toggle') || document.getElementById('north-star-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                playCinematicTransition(() => {
                    window.location.href = 'study.html';
                });
            });
        }
    }
}

function bindEvents() {
    // View toggles
    document.getElementById('view-grid').addEventListener('click', () => setViewMode('grid'));
    document.getElementById('view-list').addEventListener('click', () => setViewMode('list'));

    // Search
    document.getElementById('search-input').addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase();
        render();
    });

    // Filters
    document.getElementById('term-filter').addEventListener('change', (e) => {
        state.termFilter = e.target.value;
        render();
    });

    document.getElementById('course-filter').addEventListener('change', (e) => {
        state.typeFilter = e.target.value;
        render();
    });

    document.getElementById('items-per-page-select').addEventListener('change', (e) => {
        state.itemsPerPage = parseInt(e.target.value, 10);
        render();
    });
}

function setViewMode(mode) {
    state.viewMode = mode;
    document.getElementById('view-grid').classList.toggle('active', mode === 'grid');
    document.getElementById('view-list').classList.toggle('active', mode === 'list');
    render();
}

function toggleFavourite(id) {
    const course = state.courses.find(c => c.id === id);
    if (course) {
        course.favourite = !course.favourite;
        render();
    }
}

function render() {
    // Apply filters
    const filteredCourses = state.courses.filter(course => {
        // Search filter (title or code)
        if (state.searchQuery) {
            const matchTitle = course.title.toLowerCase().includes(state.searchQuery);
            const matchCode = course.code.toLowerCase().includes(state.searchQuery);
            if (!matchTitle && !matchCode) return false;
        }

        // Term filter
        if (state.termFilter !== 'all' && course.term !== state.termFilter) {
            return false;
        }

        // Type filter (favourites)
        if (state.typeFilter === 'favorites' && !course.favourite) {
            return false;
        }

        return true;
    });

    // Update results count
    const resultsCountEl = document.getElementById('results-count');
    resultsCountEl.textContent = `${filteredCourses.length} results`;

    // Apply pagination
    const coursesToShow = filteredCourses.slice(0, state.itemsPerPage);

    // Update grid container class based on view mode
    const gridEl = document.getElementById('course-grid');
    gridEl.className = `courses-grid ${state.viewMode}-view`;

    // Check if we are showing only favourites or all
    const sectionTitleEl = document.querySelector('.section-title');
    if (state.typeFilter === 'favorites') {
        sectionTitleEl.textContent = 'Favourites';
    } else {
        sectionTitleEl.textContent = 'Courses';
    }

    // Render cards
    gridEl.innerHTML = '';

    if (coursesToShow.length === 0) {
        gridEl.innerHTML = '<div style="grid-column: 1 / -1; padding: 32px; text-align: center; color: var(--text-muted);">No courses found matching your criteria.</div>';
        return;
    }

    coursesToShow.forEach(course => {
        const card = document.createElement('article');
        card.className = 'course-card';

        let instructorsText = course.instructors[0];
        if (course.instructors.length > 1) {
            instructorsText = 'Multiple Instructors';
        }

        const favBtnClass = course.favourite ? 'fav-btn active' : 'fav-btn';

        card.innerHTML = `
            <div class="card-image" style="background-image: url('${course.image}')" role="img" aria-label="Course image cover"></div>
            <div class="card-content">
                <div class="course-code">${course.code}</div>
                <h3 class="course-title" title="${course.title}">${course.title}</h3>
                <div class="course-links">
                    <a href="#" class="open-link">Open</a>
                    <a href="#" class="instructor-link">${instructorsText}</a>
                </div>
                <button class="${favBtnClass}" data-id="${course.id}" aria-label="${course.favourite ? 'Remove from favourites' : 'Add to favourites'}">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="${course.favourite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                </button>
            </div>
        `;

        gridEl.appendChild(card);
    });

    // Re-bind favourite buttons
    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            toggleFavourite(id);
        });
    });
}

/* ========================================================= */
/* NORTH STAR MODE LOGIC & MOCK DATA                       */
/* ========================================================= */

state.northStarSchedule = [
    {
        id: 's1', type: 'video', title: 'Lecture 5: Overfitting', timeRange: '09:00 - 09:25', durationMinutes: 25, status: 'not_started',
        varkRecommendations: {
            visual: { study: 20, break: 5, tip: 'Focus on the learning curve diagrams showing training vs validation error.' },
            audio: { study: 25, break: 0, tip: 'Listen closely to the explanation of high variance.' },
            reading: { study: 15, break: 5, tip: 'Read the summary of bias vs variance tradeoffs.' },
            kinesthetic: { study: 30, break: 5, tip: 'Draw your own underfitting and overfitting graphs.' }
        }
    },
    {
        id: 's2', type: 'notes', title: 'Overfitting Summary Notes', timeRange: '09:30 - 09:45', durationMinutes: 15, status: 'in_progress',
        varkRecommendations: {
            visual: { study: 10, break: 5, tip: 'Highlight key terms (Bias, Variance) in different colors.' },
            audio: { study: 15, break: 0, tip: 'Read the notes aloud to reinforce memory.' },
            reading: { study: 15, break: 0, tip: 'Skim the bold text first before deep reading.' },
            kinesthetic: { study: 20, break: 5, tip: 'Re-type or handwrite notes to solidify understanding.' }
        }
    },
    {
        id: 's3', type: 'quiz', title: 'Check Knowledge: Bias-Variance tradeoff', timeRange: '10:00 - 10:15', durationMinutes: 15, status: 'not_started',
        varkRecommendations: {
            visual: { study: 10, break: 5, tip: 'Visualize the options graphically before selecting.' },
            audio: { study: 10, break: 5, tip: 'Say the answer out loud.' },
            reading: { study: 15, break: 0, tip: 'Carefully read each option to avoid trick questions.' },
            kinesthetic: { study: 15, break: 0, tip: 'Use the process of elimination actively.' }
        }
    },
    {
        id: 's4', type: 'recall', title: 'Flashcards: ML Basics', timeRange: '10:15 - 10:30', durationMinutes: 15, status: 'not_started',
        varkRecommendations: {
            visual: { study: 10, break: 5, tip: 'Imagine the concept as an image before revealing.' },
            audio: { study: 10, break: 5, tip: 'Explain the concept aloud like teaching someone else.' },
            reading: { study: 15, break: 0, tip: 'Read the answer twice to retain it.' },
            kinesthetic: { study: 15, break: 0, tip: 'Write the answer down before revealing the card.' }
        }
    }
];

state.isNorthStar = false;
state.selectedScheduleItemId = 's2';
state.selectedTab = 'notes';
state.selectedVarkMode = 'visual';
state.focusSessionNumber = 3;
state.ignoreRewardCount = 2;
state.quizCurrentQuestion = 1;



function playCinematicTransition(callback) {
    const overlay = document.getElementById('cinematic-overlay');
    const bgRect = document.getElementById('cinematic-bg-rect');
    const starsContainer = document.getElementById('cinematic-stars');
    const holeCircle = document.getElementById('hole-circle');

    if (!overlay || !bgRect || !holeCircle) return callback();

    overlay.classList.add('active');

    // Reset hole
    holeCircle.style.r = '0';
    holeCircle.style.transition = 'none';

    requestAnimationFrame(() => {
        bgRect.classList.add('fade-in');

        setTimeout(() => {
            const numSparkles = 25;
            for (let i = 0; i < numSparkles; i++) {
                const sp = document.createElement('div');
                sp.className = 'cinematic-sparkle';
                const rand = Math.random();
                if (rand > 0.7) sp.classList.add('small');
                else if (rand > 0.9) sp.classList.add('large');

                sp.style.left = Math.random() * 100 + 'vw';
                sp.style.top = Math.random() * 100 + 'vh';
                sp.style.animationDelay = (Math.random() * 0.4) + 's';
                starsContainer.appendChild(sp);
            }
        }, 300);

        setTimeout(() => {
            callback();
        }, 1400); // Wait for stars to finish before redirecting
    });
}

function playCinematicReveal() {
    const overlay = document.getElementById('cinematic-overlay');
    const bgRect = document.getElementById('cinematic-bg-rect');
    const holeCircle = document.getElementById('hole-circle');

    if (!overlay || !bgRect || !holeCircle) return;

    // Start fully black
    overlay.classList.add('active');
    bgRect.classList.add('fade-in');
    bgRect.style.transition = 'none';

    // Tiny delay to ensure DOM is settled
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            holeCircle.style.transition = 'r 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            holeCircle.style.r = '150vmax';

            setTimeout(() => {
                overlay.classList.remove('active');
                bgRect.classList.remove('fade-in');
                bgRect.style.transition = '';
            }, 850);
        });
    });
}

function completeLesson() {
    const subj = state.subjects[state.selectedSubjectId];
    if (!subj) return;
    const lesson = subj.lessons.find(l => l.id === state.selectedLessonId);
    if (lesson && lesson.status !== 'done') {
        lesson.status = 'done';
        state.todayProgressPct = Math.min(100, (state.todayProgressPct || 42) + 15);
        renderStudySidebar();
        renderKALayout();
    }
}

function renderStudySidebar() {
    // 1. Progress Indicator
    const pctEl = document.getElementById('ns-progress-pct');
    if (pctEl) pctEl.textContent = (state.todayProgressPct || 42) + '%';
    const fillEl = document.getElementById('ns-progress-bar-fill');
    if (fillEl) fillEl.style.width = (state.todayProgressPct || 42) + '%';

    // 2. Timeline
    const timelineEl = document.getElementById('ns-study-timeline');
    if (timelineEl) {
        timelineEl.innerHTML = state.todayPlan.map(plan => {
            const parts = plan.subjectTitle.split(': ');
            const isBreak = plan.blockType === 'short_break' || plan.blockType === 'long_break';
            const breakStyle = isBreak ? 'opacity:0.55; font-style:italic;' : '';
            const cursorStyle = (isBreak || (!plan.courseId && !plan.subjectId)) ? 'cursor:default;' : 'cursor:pointer;';
            const durationBadge = plan.durationMinutes
                ? `<span style="font-size:0.72rem; color:var(--ns-text-muted); margin-left:4px;">(${plan.durationMinutes}m)</span>`
                : '';
            const titleHtml = parts.length > 1
                ? `<div class="ns-timeline-code">${parts[0]}</div><div class="ns-timeline-name" style="${breakStyle}">${parts[1]}${durationBadge}</div>`
                : `<div class="ns-timeline-code" style="${breakStyle}">${plan.subjectTitle}${durationBadge}</div>`;
            const clickHandler = isBreak
                ? ''
                : `onclick="selectPlanSubject('${plan.subjectId || ''}', '${plan.id}', '${plan.courseId || ''}')"`;
            return `
            <li class="ns-timeline-item ${plan.status === 'active' ? 'active' : ''} ${plan.status === 'done' ? 'done' : ''}" style="${cursorStyle}" ${clickHandler}>
                <div class="ns-timeline-dot"></div>
                <div class="ns-timeline-time">${plan.timeStart} - ${plan.timeEnd}</div>
                <div class="ns-timeline-title">${titleHtml}</div>
            </li>
        `}).join('');
    }
}

function selectPlanSubject(subjId, planId, courseId) {
    // Mark selected block as active
    state.todayPlan.forEach(p => {
        if (p.id === planId) p.status = 'active';
        else if (p.status === 'active') p.status = 'pending';
    });
    renderStudySidebar();

    if (courseId && courseAnalyticsData[courseId]) {
        // Navigate to the Course Analytics view for this course
        openCourseAnalytics(courseId);
        return;
    }

    // Fallback: deep-dive view (only used if a real subjId with content exists)
    if (!subjId) return;
    state.selectedSubjectId = subjId;
    state.selectedUnitId = '';
    state.selectedLessonId = '';

    const subj = state.subjects[subjId];
    if (subj && subj.units.length > 0) {
        state.selectedUnitId = subj.units[0].id;
        if (subj.lessons.length > 0) {
            state.selectedLessonId = subj.lessons[0].id;
        }
    }
    renderKALayout();
    switchTab('view-deepdive');
}

function renderKALayout() {
    const subj = state.subjects[state.selectedSubjectId];
    if (!subj) return;

    document.getElementById('ns-dd-breadcrumb').textContent = subj.breadcrumb;
    document.getElementById('ns-dd-title').textContent = subj.title;

    // Left Col: Units
    const unitsList = document.getElementById('ns-ka-units-list');
    if (unitsList) {
        unitsList.innerHTML = subj.units.map(u => `
            <li class="ns-ka-nav-item ${state.selectedUnitId === u.id ? 'active' : ''}" onclick="state.selectedUnitId='${u.id}'; renderKALayout();">${u.title}</li>
        `).join('');
    }

    // Center Col: Lessons
    const lessonSection = document.getElementById('ns-learn-section');
    const contentViewer = document.getElementById('ns-content-viewer');
    const lessonItemsList = document.getElementById('ns-lesson-items');

    const unitLessons = subj.lessons.filter(l => l.unitId === state.selectedUnitId);
    if (unitLessons.length > 0) {
        document.getElementById('ns-lesson-title').textContent = subj.units.find(u => u.id === state.selectedUnitId)?.title || '';
        document.getElementById('ns-lesson-desc').textContent = "Complete the following modules to master this unit.";
        lessonSection.style.display = 'block';

        lessonItemsList.innerHTML = unitLessons.map(l => {
            let icon = '📄';
            if (l.type === 'video') icon = '▶️';
            if (l.type === 'activity') icon = '💻';
            return `
            <li class="ns-lesson-item ${state.selectedLessonId === l.id ? 'active' : ''} ${l.status === 'done' ? 'done' : ''}" onclick="state.selectedLessonId='${l.id}'; renderKALayout();">
                <div class="ns-lesson-icon">${icon}</div>
                <div class="ns-lesson-item-title">${l.title}</div>
                <div style="margin-left:auto; font-size:0.8rem; color:var(--ns-text-muted);">${l.duration}</div>
            </li>`;
        }).join('');

        // Viewer
        contentViewer.classList.remove('hidden');
        const activeLesson = unitLessons.find(l => l.id === state.selectedLessonId);
        if (activeLesson) {
            let innerHtml = '';
            if (activeLesson.type === 'video') {
                innerHtml = `
                    <div class="ns-video-player" style="background: url('${activeLesson.content}') center/cover;">
                        <div style="font-size:3rem;background:rgba(0,0,0,0.5);border-radius:50%;width:80px;height:80px;display:flex;align-items:center;justify-content:center;">▶</div>
                    </div>
                `;
            } else {
                innerHtml = `<div class="ns-reading-content">${activeLesson.content.replace(/\n/g, '<br>')}</div>`;
            }
            innerHtml += `<br><button class="ns-btn-primary" onclick="completeLesson()">${activeLesson.status === 'done' ? 'Completed' : 'Mark Complete'}</button>`;
            document.getElementById('ns-content-inner').innerHTML = innerHtml;
        }

        // Check Mastery
        const allDone = unitLessons.every(l => l.status === 'done');
        if (allDone) document.getElementById('ns-mastery-box').classList.remove('hidden');
        else document.getElementById('ns-mastery-box').classList.add('hidden');
    } else {
        lessonSection.style.display = 'none';
        contentViewer.classList.add('hidden');
        document.getElementById('ns-lesson-title').textContent = "No content available";
        document.getElementById('ns-lesson-desc').textContent = "Select another unit to proceed.";
        document.getElementById('ns-mastery-box').classList.add('hidden');
    }

    // Right Col: Practice
    const pracList = document.getElementById('ns-practice-container');
    if (pracList) {
        if (subj.practiceCards && subj.practiceCards.length > 0) {
            pracList.innerHTML = subj.practiceCards.map(p => `
                <div class="ns-practice-card">
                    <div class="ns-practice-status ${p.status}">${p.status.replace('-', ' ')}</div>
                    <h4 class="ns-practice-title">${p.title}</h4>
                    <button class="ns-btn-primary full-width" style="background:var(--ns-surface); color:var(--ns-primary); border:1px solid var(--ns-primary);">Practice</button>
                </div>
            `).join('');
        } else {
            pracList.innerHTML = '<p style="color:var(--ns-text-muted); font-size:0.9rem;">No practice items for this unit.</p>';
        }
    }
}

// Quiz Modal Logic
function bindQuizEvents() {
    const startBtn = document.getElementById('ns-start-quiz-btn');
    if (startBtn) startBtn.addEventListener('click', () => { state.quizCurrentQuestion = 1; state.quizScore = 0; renderQuizModal(); });

    document.getElementById('ns-quiz-next')?.addEventListener('click', () => {
        const feedback = document.getElementById('ns-quiz-feedback');
        if (document.getElementById('ns-quiz-next').textContent === 'Check Answer') {
            const selected = document.querySelector('input[name="ns-quiz-radio"]:checked');
            if (selected) {
                if (selected.value === '1') { feedback.textContent = 'Correct!'; feedback.className = 'ns-quiz-feedback correct'; state.quizScore++; }
                else { feedback.textContent = 'Incorrect. Review the lesson.'; feedback.className = 'ns-quiz-feedback incorrect'; }
                document.getElementById('ns-quiz-next').textContent = state.quizCurrentQuestion === 5 ? 'Finish' : 'Next Question';
            }
        } else {
            if (state.quizCurrentQuestion < 5) {
                state.quizCurrentQuestion++;
                renderQuizModal();
            } else {
                document.getElementById('ns-quiz-modal').classList.add('hidden');
                // update practice status to done
                const subj = state.subjects[state.selectedSubjectId];
                if (subj && subj.practiceCards[0]) subj.practiceCards[0].status = 'done';
                renderKALayout();
            }
        }
    });
}

function renderQuizModal() {
    document.getElementById('ns-quiz-modal').classList.remove('hidden');
    document.getElementById('ns-quiz-progress-text').textContent = `Question ${state.quizCurrentQuestion} of 5`;
    document.getElementById('ns-quiz-progress-fill').style.width = (state.quizCurrentQuestion * 20) + '%';

    document.getElementById('ns-quiz-body').innerHTML = `
        <h3>Sample mastery question #${state.quizCurrentQuestion}</h3>
        <div class="ns-quiz-options">
            <label class="ns-quiz-opt"><input type="radio" name="ns-quiz-radio" value="0"> Option A</label>
            <label class="ns-quiz-opt"><input type="radio" name="ns-quiz-radio" value="1"> Option B (Correct)</label>
            <label class="ns-quiz-opt"><input type="radio" name="ns-quiz-radio" value="0"> Option C</label>
        </div>
    `;
    document.getElementById('ns-quiz-feedback').textContent = '';
    document.getElementById('ns-quiz-next').textContent = 'Check Answer';
    document.getElementById('ns-quiz-next').disabled = true;

    document.querySelectorAll('.ns-quiz-opt').forEach(opt => {
        opt.addEventListener('click', (e) => {
            document.querySelectorAll('.ns-quiz-opt').forEach(o => o.style.background = '');
            e.currentTarget.style.background = 'var(--ns-bg)';
            e.currentTarget.querySelector('input').checked = true;
            document.getElementById('ns-quiz-next').disabled = false;
        });
    });
}

// Calendar CRUD Logic
// -------- Time helpers --------
function startOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay(); // Sun=0
    const diff = (day === 0 ? -6 : 1) - day; // Monday start
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
}
function addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
}
function fmtMonthYear(date) {
    return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}
function fmtDayNum(date) { return date.getDate(); }

function pad2(n) { return String(n).padStart(2, '0'); }
function minToHHMM(min) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${pad2(h)}:${pad2(m)}`;
}
function hhmmToMin(hhmm) {
    if (!hhmm || !hhmm.includes(':')) return null;
    const [h, m] = hhmm.split(':').map(x => parseInt(x, 10));
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
}
function minToLabel(min) {
    const h = Math.floor(min / 60);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hh = ((h + 11) % 12) + 1;
    return `${hh} ${ampm}`;
}

// -------- view state --------
state.calendarView = state.calendarView || {
    weekStart: startOfWeek(new Date())
};

function renderCalendar() {
    const container = document.getElementById('ns-calendar-container');
    if (!container) return;

    const weekStart = state.calendarView.weekStart;
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    const dayStartMin = 6 * 60;   // 06:00
    const dayEndMin = 22 * 60;    // 22:00
    const PX_PER_HOUR = 120;

    const now = new Date();
    const isSameDay = (a, b) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    // hours for grid lines + labels
    const hours = [];
    for (let t = dayStartMin; t < dayEndMin; t += 60) hours.push(t);

    // Header (month + controls)
    const headerHtml = `
      <div class="cal-week__header">
        <h1 class="cal-week__title">${fmtMonthYear(weekStart)}</h1>
        <div class="cal-week__nav">
          <button class="cal-week__nav-btn" id="ns-cal2-prev" aria-label="Previous week">‹</button>
          <button class="cal-week__nav-btn cal-week__nav-btn--today" id="ns-cal2-today">Today</button>
          <button class="cal-week__nav-btn" id="ns-cal2-next" aria-label="Next week">›</button>
        </div>
      </div>
    `;

    // Day header row
    const dayHeaderHtml = `
      <div class="cal-week__days">
        <div class="cal-week__days-spacer"></div>
        ${days.map((d, idx) => {
        const label = d.toLocaleDateString(undefined, { weekday: 'short' }).substring(0, 3);
        const activeClass = isSameDay(d, now) ? 'cal-week__day-header--today' : '';
        const numActive = isSameDay(d, now) ? 'cal-week__day-num--today' : '';
        return `
              <div class="cal-week__day-header ${activeClass}">
                <span class="cal-week__day-name">${label}</span>
                <span class="cal-week__day-num ${numActive}">${fmtDayNum(d)}</span>
              </div>
            `;
    }).join('')}
      </div>
    `;

    // Grid with day columns
    const gridHtml = `
      <div class="cal-week__scroll">
        <div class="cal-grid" role="grid">
          <div class="cal-grid__hours">
            ${hours.map((t) => `
              <div class="cal-grid__hour-label" style="height:${PX_PER_HOUR}px">${minToLabel(t)}</div>
            `).join('')}
          </div>

          ${Array.from({ length: 7 }, (_, dayIdx) => {
        const isToday = isSameDay(days[dayIdx], now);

        const bgGrid = `
            <div class="cal-grid__bg">
            ${hours.map((h) => `
                <div class="cal-grid__slot" style="height:${PX_PER_HOUR}px" onclick="openCalModal(${dayIdx}, null, ${h})" role="button">
                <div class="cal-grid__slot-hover">+ Add Event</div>
                </div>
            `).join('')}
            </div>
        `;

        const eventsHtml = (state.calendarBlocks || [])
            .filter(e => Number(e.day) === dayIdx)
            .map(e => {
                const start = Math.max(e.startMin ?? dayStartMin, dayStartMin);
                const end = Math.min(e.endMin ?? (start + 60), dayEndMin);
                const top = ((start - dayStartMin) / 60) * PX_PER_HOUR;
                const minH = (e.kind === 'study') ? 72 : 24;
                const height = Math.max(minH, ((end - start) / 60) * PX_PER_HOUR - 2);

                const kind = e.kind || 'study';
                const missed = kind === 'missed';
                let bg = missed ? 'rgba(254,226,226,0.5)' : (kind === 'lecture' ? '#DBEAFE' : kind === 'tutorial' ? '#EDE9FE' : kind === 'lab' ? '#FEF9C3' : kind === 'user' ? '#F1F5F9' : kind === 'busy' ? '#E2E8F0' : '#DCFCE7');
                let bColor = missed ? '#EF4444' : (kind === 'lecture' ? '#3B82F6' : kind === 'tutorial' ? '#8B5CF6' : kind === 'lab' ? '#CA8A04' : kind === 'user' ? '#94A3B8' : kind === 'busy' ? '#64748B' : '#22C55E');
                let tColor = missed ? '#991B1B' : (kind === 'lecture' ? '#1E40AF' : kind === 'tutorial' ? '#5B21B6' : kind === 'lab' ? '#854D0E' : kind === 'user' ? '#475569' : kind === 'busy' ? '#334155' : '#166534');
                const badge = e.code || e.tag || kind.toUpperCase();

                if (e.tag) {
                    const tagInfo = (state.tags || []).find(t => t.name === e.tag);
                    if (tagInfo) {
                        bg = tagInfo.color + '25'; // e.g. 15% opacity hex roughly
                        bColor = tagInfo.color;
                        tColor = tagInfo.color;
                    }
                }

                return `
                    <div class="cal-block ${missed ? 'cal-block--missed' : ''} ${kind === 'busy' ? 'cal-block--busy' : ''}"
                        style="position:absolute; top:${top}px; left:2px; right:2px; height:${height}px; z-index:2; background:${bg}; border-left:3px solid ${bColor}; ${missed || kind === 'busy' ? 'border-style:dashed;' : ''} color:${tColor};"
                        onclick="openCalModal(${dayIdx}, '${e.id}'); event.stopPropagation();">
                    <div class="cal-block__header">
                        <span class="cal-block__time">${minToHHMM(start)} – ${minToHHMM(end)}</span>
                    </div>
                    <div class="cal-block__title" style="margin-top:${kind === 'busy' ? 4 : 0}px">${e.title || 'Untitled'}</div>
                    <div class="cal-block__tags" style="margin-top:4px;">
                        <span class="cal-block__badge" style="background:${bColor}18; color:${bColor}; border:1px solid ${bColor}40;">${missed ? 'MISSED' : badge}</span>
                    </div>
                    </div>
                `;
            }).join('');

        const nowIndicator = isToday ? (() => {
            const currentMin = now.getHours() * 60 + now.getMinutes();
            if (currentMin >= dayStartMin && currentMin <= dayEndMin) {
                const top = ((currentMin - dayStartMin) / 60) * PX_PER_HOUR;
                return `
                    <div class="cal-grid__now" style="top:${top}px">
                        <div class="cal-grid__now-dot"></div>
                        <div class="cal-grid__now-line"></div>
                    </div>
                `;
            }
            return '';
        })() : '';

        return `
            <div class="cal-grid__day-col" role="gridcell" aria-label="${days[dayIdx].toDateString()}">
            ${bgGrid}
            ${eventsHtml}
            ${nowIndicator}
            </div>
        `;
    }).join('')}
        </div>
      </div>
    `;

    // Legend
    const legendHtml = `
      <div class="cal-legend" role="region" aria-label="Calendar legend">
        <div class="cal-legend__item">
          <span class="cal-legend__swatch" style="background:#DBEAFE; border-left:3px solid #3B82F6;"></span>
          <span class="cal-legend__label">Lecture</span>
        </div>
        <div class="cal-legend__item">
          <span class="cal-legend__swatch" style="background:#EDE9FE; border-left:3px solid #8B5CF6;"></span>
          <span class="cal-legend__label">Tutorial</span>
        </div>
        <div class="cal-legend__item">
          <span class="cal-legend__swatch" style="background:#FEF9C3; border-left:3px solid #CA8A04;"></span>
          <span class="cal-legend__label">Lab</span>
        </div>
        <div class="cal-legend__item">
          <span class="cal-legend__swatch" style="background:#DCFCE7; border-left:3px solid #22C55E;"></span>
          <span class="cal-legend__label">Study Session</span>
        </div>
        <div class="cal-legend__item">
          <span class="cal-legend__swatch" style="background:#F1F5F9; border-left:3px solid #94A3B8; border-style:dashed;"></span>
          <span class="cal-legend__label">Busy</span>
        </div>
        <div class="cal-legend__item">
          <span class="cal-legend__swatch" style="background:#FEF2F2; border-left:3px solid #EF4444; border-style:dashed;"></span>
          <span class="cal-legend__label">Missed</span>
        </div>
      </div>
    `;

    container.innerHTML = `
      <div class="cal-week">
        ${headerHtml}
        ${dayHeaderHtml}
        ${gridHtml}
        ${legendHtml}
      </div>
    `;

    // Controls bindings
    document.getElementById('ns-cal2-prev')?.addEventListener('click', () => {
        state.calendarView.weekStart = addDays(state.calendarView.weekStart, -7);
        renderCalendar();
    });
    document.getElementById('ns-cal2-next')?.addEventListener('click', () => {
        state.calendarView.weekStart = addDays(state.calendarView.weekStart, 7);
        renderCalendar();
    });
    document.getElementById('ns-cal2-today')?.addEventListener('click', () => {
        state.calendarView.weekStart = startOfWeek(new Date());
        renderCalendar();
    });
}

function renderTagDropdown() {
    const list = document.getElementById('ns-cal-tags-list');
    const search = document.getElementById('ns-cal-tags-search').value.toLowerCase();

    let html = '';
    const filtered = (state.tags || []).filter(t => t.name.toLowerCase().includes(search));

    filtered.forEach(tag => {
        html += `
            <li class="ns-tag-option" data-tag="${tag.name}" style="padding: 6px 12px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                <span style="display:inline-block; width:12px; height:12px; border-radius:3px; background:${tag.color}"></span>
                ${tag.name}
            </li>
        `;
    });

    if (search.trim() && !filtered.find(t => t.name.toLowerCase() === search.trim())) {
        html += `
            <li class="ns-tag-option-create" data-tag="${search.trim()}" style="padding: 6px 12px; cursor: pointer; color: var(--ns-primary); display: flex; align-items: center; gap: 8px;">
                <span style="display:flex;align-items:center;justify-content:center; width:12px; height:12px; border-radius:3px; font-weight:bold; font-size:14px; margin-left:-2px;">+</span>
                Create "${search.trim()}"
            </li>
        `;
    }

    list.innerHTML = html;

    list.querySelectorAll('.ns-tag-option').forEach(el => {
        el.addEventListener('click', (e) => {
            selectModalTag(e.currentTarget.dataset.tag);
        });
    });

    list.querySelectorAll('.ns-tag-option-create').forEach(el => {
        el.addEventListener('click', (e) => {
            const newTagName = e.currentTarget.dataset.tag;
            const colors = ['#8B5A2B', '#4682B4', '#9370DB', '#2E8B57', '#eab308', '#ef4444', '#ec4899', '#f97316'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const newTag = { name: newTagName, color: randomColor, badgeColor: randomColor };
            if (!state.tags) state.tags = [];
            state.tags.push(newTag);
            selectModalTag(newTagName);
        });
    });
}

function selectModalTag(tagName) {
    state.currentEditTag = tagName;
    const tagInfo = (state.tags || []).find(t => t.name === tagName);
    const triggerSpan = document.getElementById('ns-cal-current-tag');
    if (tagInfo) {
        triggerSpan.innerHTML = `
            <span style="background:${tagInfo.color}33; color:${tagInfo.color}; padding: 2px 8px; border-radius: 4px; font-weight: 500; font-size: 0.85rem;">
                ${tagName}
            </span>
        `;
    } else {
        triggerSpan.textContent = "Empty";
    }
    document.getElementById('ns-cal-tags-dropdown').classList.add('hidden');
}

function bindCalendarEvents() {
    document.getElementById('ns-cal-add-btn')?.addEventListener('click', () => openCalModal(0));

    document.getElementById('ns-cal-cancel')?.addEventListener('click', () =>
        document.getElementById('ns-cal-modal').classList.add('hidden')
    );

    document.getElementById('ns-cal-modal-overlay')?.addEventListener('click', () =>
        document.getElementById('ns-cal-modal').classList.add('hidden')
    );

    const tagsTrigger = document.getElementById('ns-cal-tags-trigger');
    const tagsDropdown = document.getElementById('ns-cal-tags-dropdown');
    const tagsSearch = document.getElementById('ns-cal-tags-search');

    tagsTrigger?.addEventListener('click', (e) => {
        e.stopPropagation();
        tagsDropdown.classList.toggle('hidden');
        if (!tagsDropdown.classList.contains('hidden')) {
            tagsSearch.value = '';
            renderTagDropdown();
            tagsSearch.focus();
        }
    });

    tagsSearch?.addEventListener('input', () => {
        renderTagDropdown();
    });

    tagsSearch?.addEventListener('click', (e) => e.stopPropagation());
    tagsDropdown?.addEventListener('click', (e) => e.stopPropagation());

    document.addEventListener('click', () => {
        if (tagsDropdown && !tagsDropdown.classList.contains('hidden')) {
            tagsDropdown.classList.add('hidden');
        }
    });

    document.getElementById('ns-cal-save')?.addEventListener('click', () => {
        const modal = document.getElementById('ns-cal-modal');
        const editId = modal.dataset.editId || '';
        const id = editId || ('c' + Date.now());

        const title = document.getElementById('ns-cal-input-title').value.trim() || 'Untitled';
        const day = parseInt(document.getElementById('ns-cal-input-day').value, 10);

        let kind = 'user';
        if (state.currentEditTag) {
            kind = 'study';
        }

        const tag = state.currentEditTag || '';

        const startMin = hhmmToMin(document.getElementById('ns-cal-input-start').value);
        const endMin = hhmmToMin(document.getElementById('ns-cal-input-end').value);

        if (startMin == null || endMin == null || endMin <= startMin) {
            alert('Please set a valid start/end time (end must be after start).');
            return;
        }

        if (editId) {
            const block = state.calendarBlocks.find(b => b.id === id);
            if (block) {
                block.title = title;
                block.day = day;
                block.kind = kind;
                block.tag = tag;
                block.startMin = startMin;
                block.endMin = endMin;
            }
        } else {
            state.calendarBlocks.push({
                id,
                title,
                day,
                kind,
                tag,
                startMin,
                endMin
            });
        }

        modal.classList.add('hidden');
        renderCalendar();
    });

    document.getElementById('ns-cal-delete')?.addEventListener('click', () => {
        const modal = document.getElementById('ns-cal-modal');
        const id = modal.dataset.editId;
        if (!id) return;

        state.calendarBlocks = state.calendarBlocks.filter(b => b.id !== id);
        modal.classList.add('hidden');
        renderCalendar();
    });
}

function openCalModal(dayIdx, editId = null, startMinClicked = null, evt = null) {
    if (evt) evt.stopPropagation();
    const modal = document.getElementById('ns-cal-modal');
    modal.classList.remove('hidden');
    modal.dataset.editId = editId || '';

    const delBtn = document.getElementById('ns-cal-delete');

    const selectedDate = addDays(state.calendarView.weekStart, dayIdx);
    document.getElementById('ns-cal-text-date').textContent = selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    document.getElementById('ns-cal-input-day').value = String(dayIdx);

    if (editId) {
        delBtn.classList.remove('hidden');

        const block = state.calendarBlocks.find(b => b.id === editId);
        if (!block) return;

        document.getElementById('ns-cal-input-title').value = block.title || '';
        document.getElementById('ns-cal-input-start').value = minToHHMM(block.startMin ?? 600);
        document.getElementById('ns-cal-input-end').value = minToHHMM(block.endMin ?? 660);

        selectModalTag(block.tag || block.code || null);
    } else {
        delBtn.classList.add('hidden');

        document.getElementById('ns-cal-input-title').value = '';

        const sm = startMinClicked ?? 600;
        document.getElementById('ns-cal-input-start').value = minToHHMM(sm);
        document.getElementById('ns-cal-input-end').value = minToHHMM(sm + 60);

        selectModalTag(null);
    }
}

/* =========================================================================
   BACKEND INTEGRATION — fetch live data from /integrated-weekly
   ========================================================================= */

async function fetchAndApplyBackendData() {
    // Topic mastery from bridge_data/topic_mastery.csv (stu_001, computer_security)
    const topicMastery = {
        memory_layout: 0.82,
        stack_frame: 0.74,
        buffer_overflow: 0.41,
        format_string_vulnerability: 0.56,
        integer_overflow: 0.47,
        authentication: 0.84,
        authorization_access_control: 0.61,
        reference_monitor: 0.35
    };

    const payload = {
        student_id: "stu_001",
        subject: "computer_security",
        days_until_exam: 14,
        current_weekly_minutes: 240,
        topic_mastery: topicMastery
    };

    try {
        const res = await fetch('http://localhost:8001/integrated-weekly', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) { console.warn('Backend returned', res.status); return; }
        const data = await res.json();

        const pm = data.weekly_report.predicted_score_model;
        const baseScore = Math.round(pm.base_expected);
        const recScore = Math.round(pm.simulation_recommended_plan.expected_score);

        // 1. Dashboard stats cards
        const readinessEl = document.getElementById('ns-stat-readiness');
        if (readinessEl) readinessEl.innerHTML = `${baseScore}<span class="ns-stat-sub">/100</span>`;

        const predictedEl = document.getElementById('ns-stat-predicted');
        if (predictedEl) predictedEl.innerHTML = `${recScore}<span class="ns-stat-sub">%</span>`;

        const trendEl = document.getElementById('ns-stat-predicted-trend');
        if (trendEl) trendEl.textContent = `Projected: ${baseScore} → ${recScore}`;

        // Compute focus time from today's schedule
        let focusTimeStr = '--';
        if (data.todays_schedule && data.todays_schedule.total_study_minutes) {
            const mins = data.todays_schedule.total_study_minutes;
            const h = Math.floor(mins / 60);
            const m = mins % 60;
            focusTimeStr = h > 0 ? `${h}h ${m}m` : `${m}m`;
        }
        const focusEl = document.getElementById('ns-stat-focus');
        if (focusEl) focusEl.textContent = focusTimeStr;

        // 2. Populate courseAnalyticsData['1'] with real backend concepts
        if (data.concepts_payload && data.concepts_payload.length > 0) {
            courseAnalyticsData['1'].concepts = data.concepts_payload.map(c => ({
                id: c.id,
                name: c.name,
                exam_weightage: c.exam_weightage,
                mastery: c.mastery,
                last_practiced_at: c.last_practiced_at || null,
                prerequisites: c.prerequisites || [],
                difficulty: c.difficulty || 'medium',
            }));
            courseAnalyticsData['1'].focusTime = focusTimeStr;
        }

        // 4. Store backend prescriptive recommendations for the analytics Prescriptive Plan
        courseAnalyticsData['1'].backendRecommendations =
            data.weekly_report.prescriptive_analysis.recommendations || [];

        // 5. Store predicted score model for analytics view
        courseAnalyticsData['1'].predictedScoreModel = pm;

        // 6. Today's schedule → sidebar timeline
        if (data.todays_schedule && data.todays_schedule.blocks && data.todays_schedule.blocks.length > 0) {
            let cursor = 9 * 60; // start at 09:00
            state.todayPlan = data.todays_schedule.blocks.map((b, i) => {
                const start = minToHHMM(cursor);
                cursor += b.duration_minutes;
                const end = minToHHMM(cursor);
                cursor += 5; // 5-min break between blocks
                const conceptName = b.concept_ids[0]
                    ? b.concept_ids[0].replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                    : `Block ${i + 1}`;
                const timeLabel = b.block_type === 'short_break' ? 'Short Break'
                    : b.block_type === 'long_break' ? 'Long Break'
                    : b.block_type === 'review' ? `Review: ${conceptName}`
                    : conceptName;
                return {
                    id: `p${i + 1}`,
                    timeStart: start,
                    timeEnd: end,
                    subjectTitle: `SC3010: ${timeLabel}`,
                    durationMinutes: b.duration_minutes,
                    blockType: b.block_type,
                    status: i === 0 ? 'active' : 'pending',
                    subjectId: `subj${(i % 3) + 1}`
                };
            });
            state.todayProgressPct = 0;
            renderStudySidebar();

            // 6b. Also add study blocks to the calendar on Sunday (day 6)
            // Remove any previously injected backend study blocks
            state.calendarBlocks = state.calendarBlocks.filter(b => !b.id.startsWith('backend_study_'));

            let calCursor = 9 * 60; // start at 09:00
            data.todays_schedule.blocks.forEach((b, i) => {
                const startMin = calCursor;
                calCursor += b.duration_minutes;
                const endMin = calCursor;
                const conceptName = b.concept_ids[0]
                    ? b.concept_ids[0].replace(/_/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase())
                    : `Block ${i + 1}`;

                // Only add work/review blocks (skip short_break/long_break)
                if (b.block_type === 'work' || b.block_type === 'review') {
                    state.calendarBlocks.push({
                        id: `backend_study_${i}`,
                        title: `SC3010: ${conceptName}`,
                        day: 6, // Sunday
                        kind: 'study',
                        startMin,
                        endMin,
                        code: 'STUDY SESSION'
                    });
                }
            });
            renderCalendar();
        }

        // 7. Append SC2002 and SC2006 blocks to the timeline (after SC3010 blocks)
        _appendOtherCourseBlocks();

        // 8. Store top concepts for course mastery rings
        state.topConcepts = data.weekly_report.priority_ranking.top_concepts;
        renderNsAppCourses();

    } catch (e) {
        console.warn('Backend not reachable, using dummy data:', e);
        // Still ensure multi-course blocks exist
        _appendOtherCourseBlocks();
    }
}

/**
 * Append SC2002 and SC2006 study blocks to state.todayPlan if not already present.
 * Picks the weakest concept in each course as the focus topic.
 */
function _appendOtherCourseBlocks() {
    const otherCourses = [
        { courseId: '2', code: 'SC2002' },
        { courseId: '3', code: 'SC2006' },
    ];

    // Remove stale entries (non-SC3010 course blocks injected in a previous call)
    state.todayPlan = state.todayPlan.filter(p => !p.id.startsWith('_oc_'));

    // Compute start time after last block
    let lastEndMin = 9 * 60; // 09:00 fallback
    if (state.todayPlan.length > 0) {
        const last = state.todayPlan[state.todayPlan.length - 1];
        lastEndMin = hhmmToMin(last.timeEnd) || lastEndMin;
    }

    otherCourses.forEach(({ courseId, code }, idx) => {
        const courseData = courseAnalyticsData[courseId];
        if (!courseData) return;

        // Find weakest concept needing attention
        let annotatedConcepts = courseData.concepts.map(annotate);
        annotatedConcepts = resolveBlocked(annotatedConcepts);
        const weakest = annotatedConcepts
            .filter(c => c.flags.requiresAttention)
            .sort((a, b) => a.mastery - b.mastery)[0]
            || annotatedConcepts.sort((a, b) => a.mastery - b.mastery)[0];

        const conceptLabel = weakest ? weakest.name : courseData.name;
        const studyMins = weakest ? (_STUDY_TIME[weakest.difficulty] || 35) : 35;

        // 10-min break before each block
        const breakStart = lastEndMin + 5;
        const workStart = breakStart + 10;
        const workEnd = workStart + studyMins;

        state.todayPlan.push({
            id: `_oc_break_${courseId}`,
            timeStart: minToHHMM(breakStart),
            timeEnd: minToHHMM(breakStart + 10),
            subjectTitle: 'Short Break',
            status: 'pending',
            subjectId: null,
            courseId: null,
            durationMinutes: 10,
            blockType: 'short_break',
        });

        state.todayPlan.push({
            id: `_oc_work_${courseId}`,
            timeStart: minToHHMM(workStart),
            timeEnd: minToHHMM(workEnd),
            subjectTitle: `${code}: ${conceptLabel}`,
            status: 'pending',
            subjectId: null,
            courseId,
            durationMinutes: studyMins,
            blockType: 'work',
        });

        lastEndMin = workEnd;
    });

    renderStudySidebar();
}

const _STUDY_TIME = { easy: 20, medium: 35, hard: 50 };

/* =========================================================================
   START SESSION GATE
   ========================================================================= */

/* =========================================================================
   AI STUDY COACH (Option A)
   ========================================================================= */

/** Conversation history for the coach chat */
const _coachHistory = [];

/**
 * Builds a rich, structured mastery context for the AI Coach.
 * Includes priority scores, avoidance detection, quick wins, forgetting risk,
 * and encouragement cues — so the LLM can give genuinely personalised advice.
 */
function _buildCoachMasteryContext() {
    const lines = ['STUDENT: Janet Connor | NTU | Current semester\n'];
    const allFlat = [];   // all annotated concepts across courses
    let totalConcepts = 0, weakTotal = 0, masterySum = 0, courseCount = 0;

    const daysToExam = { '1': 18, '2': 25, '3': 32, '4': 40 };

    Object.entries(courseAnalyticsData).forEach(([id, payload]) => {
        if (!payload.concepts || !payload.concepts.length) return;
        courseCount++;
        const ann = resolveBlocked(payload.concepts.map(annotate));

        // ── Course-level stats ──────────────────────────────────────────────
        const mastery    = Math.round(computeWeightedMastery(ann) * 100);
        const daysLeft   = daysToExam[id] || 30;
        const predicted  = Math.round(Math.min(50 + computeWeightedMastery(ann) * 50, 100));
        const grade      = predicted >= 85 ? 'A' : predicted >= 75 ? 'B+' : predicted >= 65 ? 'B' : predicted >= 55 ? 'C+' : 'C';
        totalConcepts   += ann.length;
        weakTotal       += ann.filter(c => c.flags.requiresAttention).length;
        masterySum      += mastery;

        // ── Concept-level analysis ─────────────────────────────────────────
        const _prio = c => {
            const forgetting = c.daysSince > 7 ? 1.4 : c.daysSince > 3 ? 1.1 : 1.0;
            return (1 - c.mastery) * c.exam_weightage * forgetting;
        };
        const prioritised = [...ann].sort((a, b) => _prio(b) - _prio(a));

        // Avoidance: not practiced ≥14 days AND mastery < 60%
        const avoiding = ann.filter(c => c.daysSince >= 14 && c.mastery < 0.60 && c.last_practiced_at);
        // Not started at all
        const notStarted = ann.filter(c => c.flags.notStarted);
        // Quick wins: 55–76% mastery + high weight (close to proficient, just needs review)
        const quickWins = ann.filter(c => c.mastery >= 0.55 && c.mastery < 0.76 && c.exam_weightage >= 0.12);
        // Strengths: ≥80% mastery
        const strong = ann.filter(c => c.flags.strong);

        lines.push(`━━ ${payload.code}: ${payload.name} ━━`);
        lines.push(`Overall mastery: ${mastery}% | Predicted grade: ${grade} (${predicted}%) | Exam in ${daysLeft} days`);

        // Top 3 priority concepts
        lines.push('Priority (study order):');
        prioritised.slice(0, 4).forEach((c, i) => {
            const lastPrac = c.last_practiced_at
                ? (c.daysSince === Infinity ? 'never' : c.daysSince < 1 ? 'today' : `${Math.floor(c.daysSince)}d ago`)
                : 'never practiced';
            const urgency = c.flags.notStarted ? '🔴 NOT STARTED' : c.flags.blocked ? '🔴 BLOCKED' : c.flags.weak ? '🟡 WEAK' : '🟢';
            lines.push(`  ${i+1}. ${urgency} ${c.name}: ${Math.round(c.mastery*100)}% mastery, ${Math.round(c.exam_weightage*100)}% exam weight, last practiced: ${lastPrac}`);
        });

        if (avoiding.length > 0) {
            lines.push(`⚠️ POSSIBLY AVOIDING (14+ days, <60%): ${avoiding.map(c => `${c.name} (${Math.round(c.mastery*100)}%)`).join(', ')}`);
        }
        if (notStarted.length > 0) {
            lines.push(`🔴 NOT STARTED YET: ${notStarted.map(c => c.name).join(', ')}`);
        }
        if (quickWins.length > 0) {
            lines.push(`✨ QUICK WINS (one session away from proficiency): ${quickWins.map(c => `${c.name} ${Math.round(c.mastery*100)}%`).join(', ')}`);
        }
        if (strong.length > 0) {
            lines.push(`💪 STRENGTHS: ${strong.map(c => `${c.name} ${Math.round(c.mastery*100)}%`).join(', ')}`);
        }
        lines.push('');

        ann.forEach(c => allFlat.push({ ...c, courseCode: payload.code, courseName: payload.name }));
    });

    // ── Cross-course summary ────────────────────────────────────────────────
    const overallAvg = courseCount > 0 ? Math.round(masterySum / courseCount) : 0;
    lines.push(`OVERALL SNAPSHOT: ${overallAvg}% average mastery across ${courseCount} courses | ${weakTotal}/${totalConcepts} concepts need attention`);

    // Single most urgent concept across ALL courses
    const _globalPrio = c => {
        const forgetting = c.daysSince > 7 ? 1.4 : c.daysSince > 3 ? 1.1 : 1.0;
        return (1 - c.mastery) * c.exam_weightage * forgetting;
    };
    const mostUrgent = [...allFlat].sort((a, b) => _globalPrio(b) - _globalPrio(a))[0];
    if (mostUrgent) {
        lines.push(`🚨 MOST URGENT OVERALL: ${mostUrgent.name} in ${mostUrgent.courseCode} — ${Math.round(mostUrgent.mastery*100)}% mastery, ${Math.round(mostUrgent.exam_weightage*100)}% weight`);
    }

    // Recent momentum: any concepts practiced today/yesterday
    const recent = allFlat.filter(c => c.daysSince < 2 && c.last_practiced_at);
    if (recent.length > 0) {
        lines.push(`📈 RECENT ACTIVITY: Practiced ${recent.map(c => c.name).join(', ')} recently — good momentum!`);
    }

    return lines.join('\n');
}

/**
 * Sends a message to the AI Study Coach.
 * Passes live mastery context from courseAnalyticsData to the backend.
 */
async function sendCoachMessage() {
    const input = document.getElementById('ns-coach-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    _appendCoachMessage('user', text);
    _coachHistory.push({ role: 'user', content: text });

    const typingId = 'coach-typing-' + Date.now();
    _appendCoachMessage('assistant', '…', typingId);

    const masteryContext = _buildCoachMasteryContext();

    try {
        const res = await fetch('http://localhost:8000/chat/study-coach', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                student_id:      'stu_001',
                subject:         'all_courses',
                message:         text,
                history:         _coachHistory.slice(-8),
                mastery_context: masteryContext,
            }),
        });

        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();

        if (res.ok) {
            const data = await res.json();
            const reply = data.reply || 'Sorry, I could not generate a response.';
            _appendCoachMessage('assistant', reply);
            _coachHistory.push({ role: 'assistant', content: reply });
        } else {
            _appendCoachMessage('assistant', _generateLocalCoachReply(text, masteryContext));
        }
    } catch (_) {
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();
        _appendCoachMessage('assistant', _generateLocalCoachReply(text, masteryContext));
    }
}

/**
 * Convert a plain-text coach reply (with basic markdown) to safe HTML.
 * Handles: **bold**, *italic*, numbered lists, bullet lists, blank-line paragraphs.
 */
function _formatCoachText(raw) {
    if (!raw) return '';
    // Safety: escape HTML entities first
    const esc = raw
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const lines = esc.split('\n');
    let html = '';
    let inOL = false, inUL = false;

    const inlineFormat = s => s
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+?)\*/g,  '<em>$1</em>');

    const closeList = () => {
        if (inOL) { html += '</ol>'; inOL = false; }
        if (inUL) { html += '</ul>'; inUL = false; }
    };

    for (const rawLine of lines) {
        const line = rawLine.trimEnd();
        const olMatch = line.match(/^\s*(\d+)\.\s+(.+)/);
        const ulMatch = line.match(/^\s*[-•*]\s+(.+)/);

        if (olMatch) {
            if (inUL) { html += '</ul>'; inUL = false; }
            if (!inOL) { html += '<ol class="coach-list">'; inOL = true; }
            html += `<li>${inlineFormat(olMatch[2])}</li>`;
        } else if (ulMatch) {
            if (inOL) { html += '</ol>'; inOL = false; }
            if (!inUL) { html += '<ul class="coach-list">'; inUL = true; }
            html += `<li>${inlineFormat(ulMatch[1])}</li>`;
        } else if (line.trim() === '') {
            closeList();
            html += '<div class="coach-spacer"></div>';
        } else {
            closeList();
            html += `<p class="coach-p">${inlineFormat(line.trim())}</p>`;
        }
    }
    closeList();
    return html;
}

function _appendCoachMessage(role, text, id) {
    const container = document.getElementById('ns-coach-messages');
    if (!container) return;
    const div = document.createElement('div');
    div.className = `ns-coach-msg ns-coach-msg-${role}`;
    if (id) div.id = id;

    if (id) {
        // Typing indicator — animated dots
        div.innerHTML = `<div class="coach-typing-dots"><span></span><span></span><span></span></div>`;
    } else if (role === 'user') {
        // Safe user text — escape + simple format
        const safe = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        div.innerHTML = `<p class="coach-p">${safe}</p>`;
    } else {
        // Assistant — full markdown render
        div.innerHTML = _formatCoachText(text);
    }

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

/** Fallback local reply when backend is unavailable — uses live mastery data */
function _generateLocalCoachReply(question, masteryContext) {
    const q = question.toLowerCase();
    // Find weakest concepts across all loaded courseAnalyticsData
    const allConcepts = [];
    Object.entries(courseAnalyticsData).forEach(([id, payload]) => {
        (payload.concepts || []).forEach(c => {
            allConcepts.push({ ...c, course: payload.code });
        });
    });
    const sorted = [...allConcepts].sort((a, b) => a.mastery - b.mastery);
    const weakest = sorted.slice(0, 3);

    if (q.includes('today') || q.includes('study') || q.includes('what')) {
        const topics = weakest.map(c => `**${c.name}** (${c.course}, ${Math.round(c.mastery * 100)}% mastery)`).join(', ');
        return `Based on your current mastery data, I'd prioritise:\n\n${weakest.map((c,i) => `${i+1}. ${c.name} — ${c.course} (${Math.round(c.mastery*100)}% mastered, spend ~${c.difficulty==='hard'?50:c.difficulty==='easy'?20:35} min)`).join('\n')}\n\nFocus on the lowest-mastery, highest-weight concepts first for maximum exam score improvement.`;
    }
    if (q.includes('ready') || q.includes('readiness') || q.includes('score')) {
        const avg = allConcepts.reduce((s,c) => s + c.mastery, 0) / (allConcepts.length || 1);
        return `Your overall average mastery across all courses is **${Math.round(avg * 100)}%**. You have ${allConcepts.filter(c => c.mastery < 0.6).length} concepts below 60% that need attention. Keep pushing!`;
    }
    return `Great question! Based on your mastery data, the area most likely to boost your score is **${weakest[0]?.name || 'your weakest concept'}** — it's only at ${Math.round((weakest[0]?.mastery||0)*100)}% mastery. Spend focused time there first.`;
}

/* ── AI Coach helpers ─────────────────────────────────────────────────────── */

/**
 * Replaces the static HTML greeting with a personalised data-driven one
 * the first time the AI Coach view is opened.
 */
function _injectCoachGreeting() {
    const container = document.getElementById('ns-coach-messages');
    if (!container) return;

    // Build a snapshot of the student's situation
    const allConcepts = [];
    Object.entries(courseAnalyticsData).forEach(([id, payload]) => {
        (payload.concepts || []).forEach(c => {
            allConcepts.push({ ...annotate(c), courseCode: payload.code });
        });
    });
    const sorted   = [...allConcepts].sort((a, b) => a.mastery - b.mastery);
    const weakest  = sorted[0];
    const avoiding = allConcepts.filter(c => c.daysSince >= 14 && c.mastery < 0.6 && c.last_practiced_at);
    const avgPct   = allConcepts.length
        ? Math.round(allConcepts.reduce((s, c) => s + c.mastery, 0) / allConcepts.length * 100)
        : null;

    const hour = new Date().getHours();
    const timeGreet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    let greetText = `${timeGreet}, Janet! 👋 I've loaded your live mastery data across all your courses.\n\n`;

    if (avgPct !== null) {
        greetText += `Your overall average is **${avgPct}%**. `;
    }
    if (weakest) {
        greetText += `Your most urgent concept right now is **${weakest.name}** in **${weakest.courseCode}** (${Math.round(weakest.mastery * 100)}% mastery). `;
    }
    if (avoiding.length > 0) {
        greetText += `\n\nI also noticed you haven't touched **${avoiding[0].name}** in a while — that one might need some attention soon.`;
    }
    greetText += `\n\nWhat would you like to work on today? You can also use the quick prompts below ↓`;

    // Clear default static greeting, inject dynamic one
    container.innerHTML = '';
    _appendCoachMessage('assistant', greetText);
}

/** Called by quick-prompt chip buttons */
function sendCoachPrompt(text) {
    const input = document.getElementById('ns-coach-input');
    if (!input) return;
    input.value = text;
    sendCoachMessage();
}

function showStartSessionModal() {
    const overlay = document.getElementById('ns-start-session-overlay');
    if (overlay) overlay.style.display = 'flex';
}

/**
 * Called when the student clicks "Start Study Session".
 * Fetches the personalised study plan from the backend, populates the sidebar
 * timeline and course analytics, then dismisses the modal.
 */
async function beginStudySession() {
    const btn = document.getElementById('ns-begin-session-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Loading your plan…'; }

    await fetchAndApplyBackendData();

    const overlay = document.getElementById('ns-start-session-overlay');
    if (overlay) overlay.style.display = 'none';

    if (btn) { btn.disabled = false; btn.textContent = 'Start Study Session'; }
}

/* =========================================================================
   PRECISION PRACTICE — cross-subject weakness aggregation
   ========================================================================= */

/**
 * Fetches all weaknesses for stu_001 across every subject from the backend
 * analytics endpoint, then populates:
 *   1. The "Focus areas today" preview inside the Start Session modal
 *   2. The Precision Practice widget on the main dashboard
 */
async function fetchPrecisionPracticeData() {
    try {
        const res = await fetch('http://localhost:8000/analytics/all-weaknesses/stu_001');
        if (!res.ok) return;
        const data = await res.json();

        const allWeak = [];
        (data.subjects || []).forEach(subj => {
            (subj.weak_concepts || []).forEach(c => {
                allWeak.push({ ...c, subject_display: subj.subject_display });
            });
        });

        // Sort by mastery (lowest first), then by exam weight descending
        allWeak.sort((a, b) => a.mastery - b.mastery || b.exam_weightage - a.exam_weightage);

        // ── 1. Update the modal "Focus areas today" preview ────────────────
        const previewBox = document.getElementById('ns-session-weak-preview');
        const previewList = document.getElementById('ns-session-weak-list');
        if (previewBox && previewList && allWeak.length > 0) {
            previewList.innerHTML = allWeak.slice(0, 5).map(c =>
                `<li><strong>${c.name}</strong> <span style="color:var(--ns-danger)">${c.mastery_pct}% mastered</span> · ${c.study_time_minutes}m · <em>${c.subject_display}</em></li>`
            ).join('');
            previewBox.style.display = 'block';
        }

    } catch (e) {
        // Non-fatal — widget falls back to static text
    }
}

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', init);

/* =========================================================================
   NORTHSTAR SPA LOGIC (For study.html)
   ========================================================================= */

function bindNsAppEvents() {
    // Sidebar Collapse
    const collapseBtn = document.getElementById('ns-sidebar-collapse');
    if (collapseBtn) {
        collapseBtn.addEventListener('click', () => {
            state.sidebarExpanded = !state.sidebarExpanded;
            const sidebar = document.getElementById('ns-sidebar');
            if (state.sidebarExpanded) {
                sidebar.classList.remove('collapsed');
                sidebar.classList.add('expanded');
                document.getElementById('ns-collapse-icon').innerHTML = '<polyline points="15 18 9 12 15 6"></polyline>';
            } else {
                sidebar.classList.add('collapsed');
                sidebar.classList.remove('expanded');
                document.getElementById('ns-collapse-icon').innerHTML = '<polyline points="9 18 15 12 9 6"></polyline>';
            }
        });
    }

    // Tab Navigation
    document.querySelectorAll('#ns-nav-default .ns-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const targetId = item.dataset.target;
            if (targetId) {
                switchTab(targetId);

                // Update active state in sidebar
                document.querySelectorAll('#ns-nav-default .ns-nav-item').forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // Update page title
                document.getElementById('ns-page-title').textContent = item.querySelector('.ns-nav-label').textContent;
            }
        });
    });

    bindQuizEvents();

    // Back button: return to My Courses
    const backBtn = document.getElementById('btn-back-courses');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            switchTab('view-courses');
            document.getElementById('ns-page-title').textContent = 'My Courses';
            document.querySelectorAll('#ns-nav-default .ns-nav-item').forEach((nav, i) => {
                nav.classList.toggle('active', i === 0);
            });
        });
    }

    // Drawer close
    const closeDrawer = document.getElementById('btn-close-drawer');
    if (closeDrawer) closeDrawer.addEventListener('click', closeConceptDrawer);
    const drawerOverlay = document.getElementById('ns-concept-drawer');
    if (drawerOverlay) drawerOverlay.addEventListener('click', (e) => {
        if (e.target === drawerOverlay) closeConceptDrawer();
    });
}

function switchTab(viewId) {
    state.activeTab = viewId;

    if (viewId === 'view-deepdive') {
        state.isStudyMode = true;
        renderKALayout();
    } else if (viewId === 'view-readiness') {
        renderExamReadinessView();
        if (state.isStudyMode) state.isStudyMode = false;
    } else if (viewId === 'view-aicoach') {
        if (state.isStudyMode) state.isStudyMode = false;
        // Inject personalised greeting on first open
        if (!state._coachGreetingShown) {
            state._coachGreetingShown = true;
            _injectCoachGreeting();
        }
    } else if (viewId === 'view-vark' || viewId === 'view-vark-session') {
        if (state.isStudyMode) state.isStudyMode = false;
    } else {
        if (state.isStudyMode) {
            state.isStudyMode = false;
        }
    }

    document.querySelectorAll('.ns-view').forEach(view => {
        if (view.id === viewId) {
            view.classList.add('active');
            // Retrigger animation
            view.style.animation = 'none';
            view.offsetHeight; // trigger reflow
            view.style.animation = null;
        } else {
            view.classList.remove('active');
        }
    });
}

async function openCourseAnalytics(courseId) {
    state.activeCourseAnalyticsId = courseId;
    switchTab('view-course-analytics');
    document.getElementById('ns-page-title').textContent = 'Course Analytics';
    document.querySelectorAll('#ns-nav-default .ns-nav-item').forEach(nav => nav.classList.remove('active'));

    // If this course has no analytics data, use AI to generate the breakdown first
    if (!courseAnalyticsData[courseId] || courseAnalyticsData[courseId].concepts.length === 0) {
        const course = state.courses.find(c => c.id === courseId);
        if (course) {
            await _generateAndStoreCourseBreakdown(courseId, course.code, course.title);
        }
    }

    renderCourseAnalytics(courseId);
}

/** Calls the backend AI endpoint to generate concept breakdown for a new course. */
async function _generateAndStoreCourseBreakdown(courseId, code, title) {
    // Show loading state in analytics header
    const attentionList = document.getElementById('ns-analytics-attention-list');
    if (attentionList) attentionList.innerHTML = '<p style="color:var(--ns-text-muted);">⭐ AI is analysing the course and generating the concept breakdown…</p>';

    try {
        const res = await fetch('http://localhost:8000/analytics/generate-course-breakdown', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ course_name: title, course_code: code }),
        });
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        const concepts = (data.concepts || []).map((c, i) => ({
            id: c.id || `${code.toLowerCase()}_${i}`,
            name: c.name,
            exam_weightage: c.exam_weightage || (1 / (data.concepts.length || 1)),
            mastery: 0.1, // unknown student — default low so it shows as needing work
            last_practiced_at: null,
            prerequisites: c.prerequisites || [],
            difficulty: c.difficulty || 'medium',
            study_time_minutes: c.study_time_minutes || (_STUDY_TIME[c.difficulty] || 35),
        }));
        courseAnalyticsData[courseId] = {
            name: title,
            code,
            pdfSource: courseAnalyticsData[courseId]?.pdfSource ?? null,
            focusTime: '--',
            concepts,
            backendRecommendations: [],
        };
    } catch (_) {
        // Fallback: create a single placeholder concept so the view doesn't break
        courseAnalyticsData[courseId] = courseAnalyticsData[courseId] || {
            name: title, code, pdfSource: null, focusTime: '--', concepts: [], backendRecommendations: [],
        };
    }
}



/* =========================================================================
   EXAM READINESS GAUGE (Option B)
   ========================================================================= */

/**
 * Renders the full Exam Readiness view (all courses in a grid).
 * Called when the user clicks the "Exam Readiness" nav item.
 */
function renderExamReadinessView() {
    const grid = document.getElementById('ns-readiness-grid');
    if (!grid) return;

    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899'];
    const daysToExam = { '1': 18, '2': 25, '3': 32, '4': 40 };

    const cards = Object.entries(courseAnalyticsData).slice(0, 4);

    grid.innerHTML = cards.map(([id, payload], idx) => {
        const color = colors[idx % colors.length];
        const annotated = (payload.concepts || []).map(annotate);
        const weightedMastery = computeWeightedMastery(annotated);
        const readinessPct = Math.round(weightedMastery * 100);
        const predicted = Math.round(Math.min(50 + weightedMastery * 50, 100));
        const days = daysToExam[id] || 30;
        const weak = annotated.filter(c => c.flags.requiresAttention).length;
        const grade = predicted >= 85 ? 'A' : predicted >= 75 ? 'B+' : predicted >= 65 ? 'B' : predicted >= 55 ? 'C+' : 'C';
        const statusColor = readinessPct >= 75 ? 'var(--ns-success,#22c55e)' : readinessPct >= 50 ? 'var(--ns-warning,#f59e0b)' : 'var(--ns-danger,#ef4444)';

        const circumference = 2 * Math.PI * 36;
        const offset = circumference * (1 - readinessPct / 100);

        const hasPdf = payload.pdfSource !== null;

        return `
        <div class="ns-card" style="padding: 24px; cursor:pointer;" onclick="openCourseAnalytics('${id}')">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
                <div>
                    <div style="font-weight:700; font-size:1.05rem;">${payload.code}</div>
                    <div style="font-size:0.82rem; color:var(--ns-text-muted); margin-top:2px;">${payload.name}</div>
                </div>
                <svg width="88" height="88" viewBox="0 0 88 88">
                    <circle cx="44" cy="44" r="36" fill="none" stroke="var(--ns-sidebar-border)" stroke-width="7"/>
                    <circle cx="44" cy="44" r="36" fill="none" stroke="${color}" stroke-width="7"
                        stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
                        stroke-linecap="round" transform="rotate(-90 44 44)"/>
                    <text x="44" y="49" text-anchor="middle" font-size="16" font-weight="700" fill="${color}">${readinessPct}%</text>
                </svg>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.85rem;">
                <div style="background:var(--ns-bg); border-radius:10px; padding:10px 12px;">
                    <div style="color:var(--ns-text-muted); margin-bottom:3px;">Predicted Grade</div>
                    <div style="font-size:1.3rem; font-weight:700; color:${statusColor};">${grade} <span style="font-size:0.8rem;">(${predicted}%)</span></div>
                </div>
                <div style="background:var(--ns-bg); border-radius:10px; padding:10px 12px;">
                    <div style="color:var(--ns-text-muted); margin-bottom:3px;">Days to Exam</div>
                    <div style="font-size:1.3rem; font-weight:700; color:var(--ns-text-main);">${days}d</div>
                </div>
            </div>
            <div style="margin-top:12px; font-size:0.82rem; padding:8px 12px; border-radius:8px;
                background:var(--ns-bg); color:${weak > 0 ? 'var(--ns-danger)' : 'var(--ns-success,#22c55e)'};">
                ${!hasPdf
                    ? '<span style="color:var(--ns-text-muted); font-style:italic;">Need to connect with NTU Learn</span>'
                    : weak > 0
                        ? `${weak} concept${weak !== 1 ? 's' : ''} need attention`
                        : 'On track for this exam ✓'
                }
            </div>
        </div>`;
    }).join('');
}

/**
 * Renders the compact Exam Readiness gauge inside the course analytics sidebar card.
 * Called after renderCourseAnalytics().
 */
function renderAnalyticsReadinessCard(courseId) {
    const container = document.getElementById('ns-course-readiness-gauge');
    if (!container) return;

    const payload = courseAnalyticsData[courseId];
    if (!payload) { container.innerHTML = '—'; return; }

    const annotated = (payload.concepts || []).map(annotate);
    const weightedMastery = computeWeightedMastery(annotated);
    const readinessPct = Math.round(weightedMastery * 100);
    const predicted = Math.round(Math.min(50 + weightedMastery * 50, 100));
    const grade = predicted >= 85 ? 'A' : predicted >= 75 ? 'B+' : predicted >= 65 ? 'B' : predicted >= 55 ? 'C+' : 'C';
    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899'];
    const ids = Object.keys(courseAnalyticsData);
    const color = colors[ids.indexOf(courseId) % colors.length];
    const statusColor = readinessPct >= 75 ? 'var(--ns-success,#22c55e)' : readinessPct >= 50 ? 'var(--ns-warning,#f59e0b)' : 'var(--ns-danger,#ef4444)';

    const circumference = 2 * Math.PI * 38;
    const offset = circumference * (1 - readinessPct / 100);

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:12px;">
            <svg width="96" height="96" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="38" fill="none" stroke="var(--ns-sidebar-border)" stroke-width="8"/>
                <circle cx="48" cy="48" r="38" fill="none" stroke="${color}" stroke-width="8"
                    stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
                    stroke-linecap="round" transform="rotate(-90 48 48)"/>
                <text x="48" y="53" text-anchor="middle" font-size="17" font-weight="700" fill="${color}">${readinessPct}%</text>
            </svg>
            <div style="text-align:center; font-size:0.85rem;">
                <div style="font-size:1.5rem; font-weight:700; color:${statusColor};">${grade}</div>
                <div style="color:var(--ns-text-muted);">Predicted ${predicted}%</div>
            </div>
        </div>`;
}

function renderNsAppCourses() {
    const grid = document.getElementById('ns-courses-grid');
    if (!grid) return;

    // Only pick the first 4 real courses to show in the mock dashboard
    const displayCourses = state.courses.slice(0, 4);

    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899'];

    grid.innerHTML = displayCourses.map((c, idx) => {
        const analyticsPayload = courseAnalyticsData[c.id];
        const concepts = analyticsPayload ? analyticsPayload.concepts : [];
        const annotated = concepts.map(annotate);
        const weightedMastery = computeWeightedMastery(annotated);
        const masteryPct = Math.round(weightedMastery * 100);
        const attentionItems = annotated.filter(x => x.flags.requiresAttention);

        // Use real mastery from backend if available, else fallback
        const conceptMastery = state.topConcepts && state.topConcepts[idx]
            ? Math.round(state.topConcepts[idx].mastery * 100)
            : Math.floor(Math.random() * 40) + 40;
        const mastery = conceptMastery;

        const color = colors[idx % colors.length];

        // Build "Requires Attention" — only show if course has a PDF source; otherwise NTU Learn message
        const hasPdf = analyticsPayload && analyticsPayload.pdfSource !== null;
        const attentionWithTime = attentionItems.slice(0, 3).map(x => {
            const mins = x.study_time_minutes || (x.difficulty === 'hard' ? 50 : x.difficulty === 'easy' ? 20 : 35);
            return `${x.name} (~${mins}m)`;
        });
        const weakTopicText = !hasPdf
            ? null  // will show NTU Learn message
            : (attentionWithTime.join(', ') || null);

        return `
        <div class="ns-card ns-course-card" data-course-id="${c.id}" style="cursor:pointer;" onclick="openVARKSession('${c.id}')">
            <div class="ns-course-header">
                <div>
                    <h3 class="ns-course-name">${c.code}</h3>
                    <p style="margin: 4px 0 0 0; color: var(--ns-text-muted); font-size: 0.9rem;">${c.title}</p>
                </div>
                <div class="ns-mastery-ring" style="background: conic-gradient(${color} ${masteryPct}%, var(--ns-sidebar-border) 0%);">
                    <div class="ns-mastery-inner" style="color: ${color}">${masteryPct}%</div>
                </div>
            </div>
            <div class="ns-course-progress">
                <div class="ns-bar-label">
                    <span>Course Progress</span>
                    <span>${masteryPct}%</span>
                </div>
                <div class="ns-progress-bg">
                    <div class="ns-progress-fill" style="width: ${masteryPct}%; background: ${color}"></div>
                </div>
                ${!hasPdf
                    ? `<div class="ns-weak-topics" style="color:var(--ns-text-muted); font-style:italic; font-size:0.82rem;">Need to connect with NTU Learn for course materials</div>`
                    : weakTopicText
                        ? `<div class="ns-weak-topics" style="color:var(--ns-danger);">Requires Attention: ${weakTopicText}</div>`
                        : `<div class="ns-weak-topics" style="color:var(--ns-success,#22c55e);">On track ✓</div>`
                }
            </div>
        </div>
        `;
    }).join('');
}

/* =========================================================
   COURSE ANALYTICS ENGINE
   Mirrors mastery_to_concepts_payload() from bridge.py
   ========================================================= */

/**
 * Mock bridge data keyed by course.id
 * Schema mirrors: mastery_to_concepts_payload(mastery_state, exam_weights, curriculum_meta)
 * { id, name, exam_weightage, mastery [0-1], last_practiced_at (ISO|null), prerequisites [id], difficulty }
 *
 * Replace `concepts` array below with a real fetch:
 *   const payload = await fetch('/api/course-report?course_id=' + courseId).then(r => r.json());
 */
const courseAnalyticsData = {
    '1': { // SC3010 — populated from backend; PDF: computer-security.pdf + Tutorial 3.pdf
        name: 'Computer Security',
        code: 'SC3010',
        pdfSource: 'computer-security.pdf',
        focusTime: '--',
        concepts: [],
        backendRecommendations: [],
    },
    '2': { // SC2002 — concepts from OOP-Workbook.pdf (sample_data)
        name: 'Object Oriented Design and Programming',
        code: 'SC2002',
        pdfSource: 'OOP-Workbook.pdf',
        focusTime: '2h 45m',
        concepts: [
            { id: 's01', name: 'Object-Oriented Design', exam_weightage: 0.15, mastery: 0.85, last_practiced_at: '2026-03-01T09:00:00Z', prerequisites: [], difficulty: 'easy' },
            { id: 's02', name: 'Objects in Python', exam_weightage: 0.12, mastery: 0.78, last_practiced_at: '2026-02-28T08:00:00Z', prerequisites: ['s01'], difficulty: 'easy' },
            { id: 's03', name: 'Inheritance and Polymorphism', exam_weightage: 0.20, mastery: 0.52, last_practiced_at: '2026-02-20T14:00:00Z', prerequisites: ['s01', 's02'], difficulty: 'medium' },
            { id: 's04', name: 'Modules and Packages', exam_weightage: 0.10, mastery: 0.70, last_practiced_at: '2026-02-26T11:00:00Z', prerequisites: ['s02'], difficulty: 'easy' },
            { id: 's05', name: 'Object Serialization', exam_weightage: 0.15, mastery: 0.30, last_practiced_at: null, prerequisites: ['s03'], difficulty: 'hard' },
            { id: 's06', name: 'Regular Expressions', exam_weightage: 0.13, mastery: 0.28, last_practiced_at: null, prerequisites: ['s02'], difficulty: 'medium' },
            { id: 's07', name: 'String Formatting', exam_weightage: 0.08, mastery: 0.65, last_practiced_at: '2026-02-23T10:00:00Z', prerequisites: ['s02'], difficulty: 'easy' },
            { id: 's08', name: 'Object-Oriented Programs', exam_weightage: 0.07, mastery: 0.60, last_practiced_at: '2026-02-25T09:00:00Z', prerequisites: ['s01','s03'], difficulty: 'medium' },
        ]
    },
    '3': { // SC2006 — concepts from SWE.pdf (sample_data): Fundamentals of Software Engineering Ch.1
        name: 'Software Engineering',
        code: 'SC2006',
        pdfSource: 'SWE.pdf',
        focusTime: '4h 10m',
        concepts: [
            { id: 'e01', name: 'Programmer to Engineer (SDLC)', exam_weightage: 0.15, mastery: 0.80, last_practiced_at: '2026-03-01T10:00:00Z', prerequisites: [], difficulty: 'easy' },
            { id: 'e02', name: 'Reading & Working with Legacy Code', exam_weightage: 0.18, mastery: 0.55, last_practiced_at: '2026-02-28T13:00:00Z', prerequisites: ['e01'], difficulty: 'medium' },
            { id: 'e03', name: 'Algorithm Efficiency & Big O', exam_weightage: 0.18, mastery: 0.72, last_practiced_at: '2026-02-27T09:00:00Z', prerequisites: [], difficulty: 'medium' },
            { id: 'e04', name: 'Code Quality & Design Principles', exam_weightage: 0.20, mastery: 0.45, last_practiced_at: '2026-02-22T14:00:00Z', prerequisites: ['e02'], difficulty: 'hard' },
            { id: 'e05', name: 'Requirements & Problem Understanding', exam_weightage: 0.15, mastery: 0.38, last_practiced_at: '2026-02-18T08:00:00Z', prerequisites: ['e01'], difficulty: 'hard' },
            { id: 'e06', name: 'Testing & Bug Prevention', exam_weightage: 0.14, mastery: 0.22, last_practiced_at: null, prerequisites: ['e04'], difficulty: 'hard' },
        ]
    },
    '4': { // MH1810 — no PDF in sample_data; show NTU Learn connection message
        name: 'Mathematics I',
        code: 'MH1810',
        pdfSource: null,
        focusTime: '5h 30m',
        concepts: [
            { id: 'm01', name: 'Limits & Continuity', exam_weightage: 0.12, mastery: 0.92, last_practiced_at: '2026-03-01T08:00:00Z', prerequisites: [], difficulty: 'easy' },
            { id: 'm02', name: 'Differentiation', exam_weightage: 0.18, mastery: 0.85, last_practiced_at: '2026-02-28T09:00:00Z', prerequisites: ['m01'], difficulty: 'medium' },
            { id: 'm03', name: 'Integration Techniques', exam_weightage: 0.20, mastery: 0.65, last_practiced_at: '2026-02-26T14:00:00Z', prerequisites: ['m02'], difficulty: 'hard' },
            { id: 'm04', name: 'Differential Equations', exam_weightage: 0.20, mastery: 0.38, last_practiced_at: '2026-02-20T10:00:00Z', prerequisites: ['m02', 'm03'], difficulty: 'hard' },
            { id: 'm05', name: 'Sequences & Series', exam_weightage: 0.15, mastery: 0.55, last_practiced_at: '2026-02-24T11:00:00Z', prerequisites: ['m01'], difficulty: 'medium' },
            { id: 'm06', name: 'Linear Algebra', exam_weightage: 0.15, mastery: 0.30, last_practiced_at: null, prerequisites: [], difficulty: 'hard' },
        ]
    }
};

/* -------- Derived analytics helpers -------- */

/**
 * annotate() — adds computed flags to a concept object
 * Mirrors the rules defined in bridge.py / insights.py
 */
function annotate(c) {
    const now = new Date();
    const lastPrac = c.last_practiced_at ? new Date(c.last_practiced_at) : null;
    const daysSince = lastPrac ? (now - lastPrac) / (1000 * 60 * 60 * 24) : Infinity;

    const flags = {
        notStarted: !lastPrac && c.mastery <= 0.2,
        weak: c.mastery < 0.6,
        strong: c.mastery >= 0.8,
        highWeight: c.exam_weightage >= 0.15,
        dueReview: daysSince > 7 && c.mastery < 0.8 && lastPrac !== null,
        blocked: false // resolved below after full annotated list
    };

    flags.requiresAttention = (flags.highWeight && flags.weak) || flags.notStarted || flags.dueReview;
    return { ...c, flags, daysSince };
}

/** Resolve blocked flag (prereq mastery < 0.6) — requires full map */
function resolveBlocked(annotatedList) {
    const masteryMap = Object.fromEntries(annotatedList.map(c => [c.id, c.mastery]));
    return annotatedList.map(c => {
        const blocked = (c.prerequisites || []).some(pid => (masteryMap[pid] ?? 1) < 0.6);
        const requiresAttention = c.flags.requiresAttention || blocked;
        return { ...c, flags: { ...c.flags, blocked, requiresAttention } };
    });
}

function computeWeightedMastery(annotatedList) {
    const totalWeight = annotatedList.reduce((s, c) => s + c.exam_weightage, 0);
    if (totalWeight === 0) return 0.5;
    return annotatedList.reduce((s, c) => s + c.mastery * c.exam_weightage, 0) / totalWeight;
}

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

/** Friendly relative time */
function relativeTime(isoStr) {
    if (!isoStr) return 'Never';
    const diff = (Date.now() - new Date(isoStr)) / (1000 * 60 * 60 * 24);
    if (diff < 1) return 'Today';
    if (diff < 2) return 'Yesterday';
    return `${Math.floor(diff)}d ago`;
}

/** Reason chips for an attention item */
function reasonChips(c) {
    const chips = [];
    if (c.flags.notStarted) chips.push('<span class="ns-badge ns-badge-neutral">Not started</span>');
    if (c.flags.weak) chips.push('<span class="ns-badge ns-badge-danger">Low mastery</span>');
    if (c.flags.highWeight) chips.push('<span class="ns-badge ns-badge-warning">High weight</span>');
    if (c.flags.dueReview) chips.push('<span class="ns-badge ns-badge-info">Due review</span>');
    if (c.flags.blocked) chips.push('<span class="ns-badge ns-badge-danger">Blocked by prereq</span>');
    return chips.join('');
}

/** Status badge */
function statusBadge(c) {
    if (c.flags.strong) return '<span class="ns-badge ns-badge-success">Strong</span>';
    if (c.flags.blocked) return '<span class="ns-badge ns-badge-danger">Blocked</span>';
    if (c.flags.notStarted) return '<span class="ns-badge ns-badge-neutral">Not Started</span>';
    if (c.flags.dueReview) return '<span class="ns-badge ns-badge-info">Review</span>';
    if (c.flags.weak) return '<span class="ns-badge ns-badge-warning">Weak</span>';
    return '<span class="ns-badge ns-badge-success">On Track</span>';
}

/** Difficulty badge */
function difficultyBadge(diff) {
    const map = {
        easy: '<span class="ns-diff-dot ns-diff-easy"></span>Easy',
        medium: '<span class="ns-diff-dot ns-diff-medium"></span>Medium',
        hard: '<span class="ns-diff-dot ns-diff-hard"></span>Hard',
    };
    return `<span style="display:inline-flex;align-items:center;">${map[diff] || diff}</span>`;
}

/** Mastery progress cell */
function masteryCell(mastery) {
    const pct = Math.round(mastery * 100);
    const color = pct >= 80 ? 'var(--ns-success)' : pct >= 60 ? 'var(--ns-warning)' : 'var(--ns-danger)';
    return `<div class="ns-mastery-cell">
        <div class="ns-progress-bar-bg" style="flex:1; height:6px;">
            <div class="ns-progress-bar-fill" style="width:${pct}%; background:${color};"></div>
        </div>
        <span style="font-weight:700; font-size:0.9rem; color:${color}; min-width:36px; text-align:right;">${pct}%</span>
    </div>`;
}

/* -------- Main renderer -------- */

function renderCourseAnalytics(courseId) {
    const payload = courseAnalyticsData[courseId];
    if (!payload) return;

    const course = state.courses.find(c => c.id === courseId);
    if (!course) return;

    // 1. Header
    document.getElementById('ns-analytics-course-code').textContent = payload.code || course.code;
    document.getElementById('ns-analytics-course-title').textContent = payload.name || course.title;

    // 2. Annotate concepts
    let annotated = payload.concepts.map(annotate);
    annotated = resolveBlocked(annotated);
    state.analyticsAnnotated = annotated; // cache for drawer lookups

    // 3. Compute KPIs — use backend predicted score model if available
    let readiness, predicted;
    if (payload.predictedScoreModel) {
        readiness = Math.round(payload.predictedScoreModel.base_expected);
        predicted = Math.round(payload.predictedScoreModel.simulation_recommended_plan.expected_score);
    } else {
        const weightedMastery = computeWeightedMastery(annotated);
        readiness = Math.round(weightedMastery * 100);
        predicted = Math.round(clamp(50 + weightedMastery * 50, 0, 100));
    }
    const attentionCount = annotated.filter(c => c.flags.requiresAttention).length;
    const focusTime = payload.focusTime || '\u2014';

    document.getElementById('ns-analytics-readiness').innerHTML = `${readiness}<span class="ns-stat-sub">/100</span>`;
    document.getElementById('ns-analytics-readiness-trend').textContent = readiness >= 75 ? '\u2191 On track' : 'Needs improvement';
    document.getElementById('ns-analytics-readiness-trend').className = `ns-stat-trend ${readiness >= 75 ? 'positive' : 'negative'}`;
    document.getElementById('ns-analytics-predicted').innerHTML = `${predicted}<span class="ns-stat-sub">%</span>`;
    document.getElementById('ns-analytics-predicted-trend').textContent = payload.predictedScoreModel
        ? `Based on current mastery trend`
        : `Based on current mastery trend`;
    document.getElementById('ns-analytics-focus').textContent = focusTime;
    document.getElementById('ns-analytics-attention-count').textContent = attentionCount;

    // 4. Render attention list
    renderAttentionList(annotated);

    // 5. Render table (default: sorted by mastery asc)
    state.analyticsFilter = 'all';
    state.analyticsSort = 'mastery-asc';
    renderConceptTableFilters(annotated);
    renderConceptTable(annotated);

    // 6. Exam Readiness card in sidebar
    renderAnalyticsReadinessCard(courseId);
}

function renderAttentionList(annotated) {
    const list = document.getElementById('ns-analytics-attention-list');
    if (!list) return;
    const attentionItems = annotated.filter(c => c.flags.requiresAttention).slice(0, 3);
    if (attentionItems.length === 0) {
        list.innerHTML = '<p style="color: var(--ns-text-muted); font-size:0.9rem;">\u2728 No flagged concepts \u2014 you\'re on top of things!</p>';
        return;
    }
    list.innerHTML = attentionItems.map(c => `
        <div class="ns-attention-item">
            <div class="ns-attention-info">
                <h4>${c.name}</h4>
                <p>Mastery: ${Math.round(c.mastery * 100)}% &bull; Weight: ${Math.round(c.exam_weightage * 100)}%</p>
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;">${reasonChips(c)}</div>
            </div>
        </div>
    `).join('');
}

function renderConceptTableFilters(annotated) {
    const filters = document.getElementById('ns-analytics-filters');
    if (!filters) return;

    const options = [
        { key: 'all', label: 'All' },
        { key: 'weak', label: 'Weak' },
        { key: 'highWeight', label: 'High Weight' },
        { key: 'notStarted', label: 'Not Started' },
        { key: 'blocked', label: 'Blocked' },
        { key: 'dueReview', label: 'Due Review' },
    ];

    filters.innerHTML = options.map(opt => `
        <button class="ns-badge ${state.analyticsFilter === opt.key ? 'ns-badge-info' : 'ns-badge-neutral'}"
            style="cursor:pointer; padding:6px 14px; border:none;"
            onclick="setAnalyticsFilter('${opt.key}')">${opt.label}</button>
    `).join('');
}

function setAnalyticsFilter(key) {
    state.analyticsFilter = key;
    const payload = courseAnalyticsData[state.activeCourseAnalyticsId];
    if (!payload) return;
    let annotated = payload.concepts.map(annotate);
    annotated = resolveBlocked(annotated);
    state.analyticsAnnotated = annotated;
    renderConceptTableFilters(annotated);
    renderConceptTable(annotated);
}

/** Prescriptive action type per concept */
function conceptAction(c) {
    if (c.flags.notStarted) return { type: 'learn', time: 90 };
    if (c.flags.blocked) return { type: 'unblock', time: 60 };
    if (c.flags.dueReview) return { type: 'revise', time: 45 };
    if (c.flags.weak) return { type: 'reinforce', time: 60 };
    return { type: 'maintain', time: 25 };
}

/** Why text per flag combo */
function conceptWhy(c) {
    if (c.flags.notStarted) return `You haven't started this yet. With ${Math.round(c.exam_weightage * 100)}% exam weight, beginning now will have a high score impact.`;
    if (c.flags.blocked) return `Prerequisite concepts have low mastery (<60%). Strengthen foundations first to unlock solid understanding here.`;
    if (c.flags.dueReview) return `High forgetting risk — it's been ${Math.floor(c.daysSince)}d since last practice. Quick revision now stabilizes memory retention.`;
    if (c.flags.weak && c.flags.highWeight) return `Low mastery (${Math.round(c.mastery * 100)}%) on a high-weight (${Math.round(c.exam_weightage * 100)}%) concept — prime target for score improvement.`;
    if (c.flags.weak) return `Mastery at ${Math.round(c.mastery * 100)}% — below the 60% threshold. Focused practice will consolidate understanding.`;
    return `You're doing well here (${Math.round(c.mastery * 100)}%). A short revision session will lock in your mastery before the exam.`;
}

/** Next steps bullets per action type */
function conceptNextSteps(c, action) {
    const steps = {
        learn: [
            'Read the core concept notes / lecture slides (20–30 min)',
            'Watch a short explainer video or worked example',
            'Attempt 3–5 starter practice questions',
            'Create a concept map or summary sheet',
        ],
        unblock: [
            `First revise: ${(c.prerequisites || []).join(', ') || 'prerequisite topics'} to ≥60% mastery`,
            'Then revisit this concept with that foundation in place',
            'Do active recall: solve questions without looking at notes',
        ],
        revise: [
            'Review notes for 15 min — focus on key definitions',
            'Do 3–5 quick recall questions from memory',
            'Create 10 flashcards / cues for spaced repetition',
        ],
        reinforce: [
            'Attempt past exam questions on this concept',
            'Identify which sub-topics you consistently get wrong',
            'Keep an error log and reattempt after 24 hours',
        ],
        maintain: [
            'Quick 10-min review once a week to avoid decay',
            'Test yourself with 2–3 application-level questions',
        ],
    };
    return steps[action.type] || steps.revise;
}

function renderConceptTable(annotated) {
    const container = document.getElementById('ns-analytics-table-body');
    if (!container) return;

    // Check if backend recommendations are available for courseId '1'
    const payload = courseAnalyticsData[state.activeCourseAnalyticsId];
    const backendRecs = (payload && payload.backendRecommendations && payload.backendRecommendations.length > 0)
        ? payload.backendRecommendations
        : null;

    // Build a lookup map from backend recs (concept_id -> recommendation)
    const recsMap = {};
    if (backendRecs) {
        backendRecs.forEach(r => { recsMap[r.concept_id] = r; });
    }

    // Apply filter
    let filtered = annotated;
    const f = state.analyticsFilter || 'all';
    if (f !== 'all') filtered = annotated.filter(c => c.flags[f]);

    // Sort by mastery ascending (weakest first — most actionable)
    filtered = [...filtered].sort((a, b) => a.mastery - b.mastery);

    if (filtered.length === 0) {
        container.innerHTML = `<div style="padding:24px; text-align:center; color:var(--ns-text-muted);">No concepts match this filter.</div>`;
        return;
    }

    container.innerHTML = filtered.map(c => {
        // Use backend recommendation if available, else compute locally
        const backendRec = recsMap[c.id];
        let actionLabel, time, why, steps;

        if (backendRec) {
            actionLabel = backendRec.action_type.charAt(0).toUpperCase() + backendRec.action_type.slice(1);
            time = backendRec.minutes;
            why = backendRec.rationale;
            steps = backendRec.next_steps || [];
        } else {
            const act = conceptAction(c);
            actionLabel = { learn: 'Learn', revise: 'Revise', reinforce: 'Reinforce', unblock: 'Unblock', maintain: 'Maintain' }[act.type] || act.type;
            time = act.time;
            why = conceptWhy(c);
            steps = conceptNextSteps(c, act);
        }

        const pct = Math.round(c.mastery * 100);
        const color = pct >= 80 ? 'var(--ns-success)' : pct >= 60 ? 'var(--ns-warning)' : 'var(--ns-danger)';

        return `
        <div class="ns-prescriptive-card">
            <div class="ns-presc-header">
                <div>
                    <div class="ns-presc-title">${c.name}</div>
                    <div class="ns-presc-action-type">${actionLabel}</div>
                </div>
                <div class="ns-presc-meta">
                    <span class="ns-presc-time">${time} min</span>
                    <div class="ns-presc-mastery-row">
                        <div style="width:80px; height:5px; background:var(--ns-sidebar-border); border-radius:4px; overflow:hidden; display:inline-block; vertical-align:middle;">
                            <div style="width:${pct}%; height:100%; background:${color};"></div>
                        </div>
                        <span style="font-size:0.8rem; color:${color}; font-weight:700; margin-left:6px;">${pct}%</span>
                    </div>
                </div>
            </div>
            <p class="ns-presc-why"><strong>Why:</strong> ${why}</p>
            <div class="ns-presc-steps">
                <p class="ns-presc-steps-label">Next steps:</p>
                <ul>${steps.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
        </div>
        `;
    }).join('');
}

function renderQuickInsights(annotated) {
    const list = document.getElementById('ns-analytics-insights-list');
    if (!list) return;

    const sorted = [...annotated].sort((a, b) => a.mastery - b.mastery);
    const weakest = sorted[0];
    const strongest = [...annotated].sort((a, b) => b.mastery - a.mastery)[0];
    const notStarted = annotated.filter(c => c.flags.notStarted).length;
    const highImpact = annotated.filter(c => c.flags.highWeight && c.flags.weak);

    const insights = [
        weakest ? `<strong>Focus on:</strong> ${weakest.name} (${Math.round(weakest.mastery * 100)}% mastery, ${Math.round(weakest.exam_weightage * 100)}% weight)` : null,
        strongest ? `<strong>Strength:</strong> ${strongest.name} \u2014 ${Math.round(strongest.mastery * 100)}% mastery, keep it up!` : null,
        notStarted > 0 ? `<strong>${notStarted} concept${notStarted > 1 ? 's' : ''}</strong> not yet started \u2014 tackle these before the exam.` : null,
        highImpact.length > 0 ? `<strong>${highImpact.length} high-weight, weak</strong> concept${highImpact.length > 1 ? 's' : ''} need urgent attention.` : null,
    ].filter(Boolean);

    list.innerHTML = insights.map(t => `<li>${t}</li>`).join('');
}

/* -------- Concept Drawer -------- */

function openConceptDrawer(conceptId) {
    const all = state.analyticsAnnotated || [];
    const c = all.find(x => x.id === conceptId);
    if (!c) return;

    document.getElementById('ns-drawer-title').textContent = c.name;
    document.getElementById('ns-drawer-mastery-fill').style.width = Math.round(c.mastery * 100) + '%';
    document.getElementById('ns-drawer-mastery-text').textContent = Math.round(c.mastery * 100) + '%';
    document.getElementById('ns-drawer-weight').textContent = Math.round(c.exam_weightage * 100) + '%';

    // Badges
    document.getElementById('ns-drawer-badges').innerHTML = [
        difficultyBadge(c.difficulty),
        statusBadge(c)
    ].join('');

    // Prerequisites
    const prereqList = document.getElementById('ns-drawer-prereqs');
    const masteryMap = Object.fromEntries(all.map(x => [x.id, x]));
    if (c.prerequisites && c.prerequisites.length > 0) {
        prereqList.innerHTML = c.prerequisites.map(pid => {
            const prereq = masteryMap[pid];
            if (!prereq) return '';
            const pct = Math.round(prereq.mastery * 100);
            const color = pct >= 60 ? 'var(--ns-success)' : 'var(--ns-danger)';
            return `<li class="ns-prereq-item">
                <span>${prereq.name}</span>
                <span style="font-weight:700; color:${color};">${pct}%</span>
            </li>`;
        }).filter(Boolean).join('');
    } else {
        prereqList.innerHTML = '<li class="ns-prereq-item" style="color:var(--ns-text-muted);">No prerequisites</li>';
    }

    // Recommendation text
    const rec = document.getElementById('ns-drawer-recommendation');
    let why = '';
    if (c.flags.notStarted) why = `You haven't started "${c.name}" yet. With ${Math.round(c.exam_weightage * 100)}% exam weight, starting now will have a high score impact.`;
    else if (c.flags.blocked) why = `Some prerequisites for "${c.name}" have low mastery. Strengthen those first to unlock solid understanding.`;
    else if (c.flags.dueReview) why = `It's been ${Math.floor(c.daysSince)} days since you last practiced "${c.name}". Spaced repetition now will lock in your memory.`;
    else if (c.flags.weak) why = `"${c.name}" is below 60% mastery with ${Math.round(c.exam_weightage * 100)}% exam weight — prime target for a quick mark gain.`;
    else why = `"${c.name}" looks good! A quick review session will lock in your strong mastery before the exam.`;
    rec.textContent = why;

    // Bind CTA — launches AI-generated quiz for this concept
    document.getElementById('btn-drawer-practice').onclick = () => startConceptPractice(conceptId);

    document.getElementById('ns-concept-drawer').classList.remove('hidden');
}

function closeConceptDrawer() {
    document.getElementById('ns-concept-drawer').classList.add('hidden');
}

/* =========================================================================
   CONCEPT PRACTICE QUIZ  —  AI-generated targeted questions
   ========================================================================= */

const _SUBJECT_MAP = {
    '1': 'computer security',
    '2': 'object-oriented design and programming',
    '3': 'software engineering',
    '4': 'mathematics',
};

/**
 * Called from "Start Practice" in the attention list or the concept drawer.
 * Closes the drawer, opens the quiz modal with a loading state, fetches
 * AI-generated questions from the backend, then renders the quiz.
 */
async function startConceptPractice(conceptId) {
    const all = state.analyticsAnnotated || [];
    const c = all.find(x => x.id === conceptId);
    if (!c) return;

    closeConceptDrawer();

    // Open quiz modal with a loading spinner
    const modal = document.getElementById('ns-quiz-modal');
    modal.classList.remove('hidden');
    document.getElementById('ns-quiz-progress-text').textContent = 'Generating questions…';
    document.getElementById('ns-quiz-progress-fill').style.width = '10%';
    document.getElementById('ns-quiz-feedback').textContent = '';
    document.getElementById('ns-quiz-next').disabled = true;
    document.getElementById('ns-quiz-next').textContent = 'Check Answer';
    document.getElementById('ns-quiz-body').innerHTML = `
        <div style="text-align:center; padding:48px 20px;">
            <div style="font-size:2.5rem; margin-bottom:16px;">⭐</div>
            <p style="color:var(--ns-text-muted); font-size:1rem;">
                Generating questions for<br><strong>${c.name}</strong>…
            </p>
        </div>`;

    const subject = _SUBJECT_MAP[state.activeCourseAnalyticsId] || 'computer science';

    try {
        const res = await fetch('http://localhost:8000/quiz/generate-concept-questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ concept_name: c.name, subject, difficulty: c.difficulty }),
        });
        if (!res.ok) throw new Error('API error ' + res.status);
        const data = await res.json();
        state.conceptQuizQuestions = (data.questions || []).slice(0, 5);
    } catch (_) {
        state.conceptQuizQuestions = generateFallbackQuestions(c);
    }

    if (!state.conceptQuizQuestions || state.conceptQuizQuestions.length === 0) {
        state.conceptQuizQuestions = generateFallbackQuestions(c);
    }

    state.quizCurrentQuestion = 0;
    state.quizScore = 0;
    state.quizConceptName = c.name;
    renderConceptQuizQuestion();
}

/** Fallback questions used when the AI endpoint is unavailable. */
function generateFallbackQuestions(c) {
    const n = c.name;
    const w = Math.round(c.exam_weightage * 100);
    return [
        {
            question: `Which statement BEST describes the purpose of "${n}"?`,
            options: { A: 'It is used only for performance optimisation', B: 'It is a core concept that must be understood to apply the subject correctly', C: 'It is an optional extension rarely used in practice', D: 'It applies only to legacy systems' },
            correct: 'B',
            explanation: `"${n}" is a foundational concept with ${w}% exam weight — getting it right has a direct score impact.`,
        },
        {
            question: `A student ignores "${n}" during exam prep. What is the most likely consequence?`,
            options: { A: 'No noticeable impact on the grade', B: 'Only bonus marks are affected', C: `A potential loss of up to ${w}% on the exam`, D: 'The student can compensate easily with other topics' },
            correct: 'C',
            explanation: `"${n}" carries ${w}% of exam weight, so not mastering it risks losing those marks.`,
        },
        {
            question: `Which learning activity is MOST effective for improving mastery of "${n}"?`,
            options: { A: 'Re-reading lecture slides passively', B: 'Attempting past-paper questions and reviewing mistakes', C: 'Watching an unrelated video', D: 'Memorising the textbook index' },
            correct: 'B',
            explanation: 'Active retrieval practice (past-paper questions + error review) is the most evidence-backed method for concept mastery.',
        },
        {
            question: `"${n}" has prerequisite concepts. Why does mastering those FIRST matter?`,
            options: { A: 'It does not — prerequisites can be skipped safely', B: 'Only if the exam is open-book', C: 'Understanding foundations prevents misconceptions that are hard to fix later', D: 'It only matters for grad-level courses' },
            correct: 'C',
            explanation: 'Gaps in prerequisite knowledge compound: weak foundations lead to systematic errors in advanced topics.',
        },
        {
            question: `Which of the following signals that a student has MASTERED "${n}"?`,
            options: { A: 'They can recite the definition from memory', B: 'They can apply the concept to solve novel problems without referring to notes', C: 'They attended the lecture on it', D: 'They highlighted the relevant textbook pages' },
            correct: 'B',
            explanation: 'True mastery means being able to transfer knowledge to new, unseen problems — not just recall.',
        },
    ];
}

/** Render a single question in the shared quiz modal. */
function renderConceptQuizQuestion() {
    const questions = state.conceptQuizQuestions || [];
    const idx = state.quizCurrentQuestion;
    const total = questions.length;

    const modal = document.getElementById('ns-quiz-modal');
    modal.classList.remove('hidden');

    if (idx >= total) {
        // ── Completion screen ──
        const pct = total > 0 ? Math.round(state.quizScore / total * 100) : 0;
        const emoji = pct >= 70 ? '🎉' : pct >= 50 ? '📚' : '💪';
        document.getElementById('ns-quiz-progress-text').textContent = 'Complete!';
        document.getElementById('ns-quiz-progress-fill').style.width = '100%';
        document.getElementById('ns-quiz-feedback').textContent = '';
        document.getElementById('ns-quiz-body').innerHTML = `
            <div style="text-align:center; padding:24px 20px;">
                <div style="font-size:3rem; margin-bottom:12px;">${emoji}</div>
                <h3 style="margin:0 0 8px 0;">${state.quizConceptName || 'Quiz'} Complete</h3>
                <p style="font-size:1.5rem; font-weight:700; margin:12px 0;">${state.quizScore} / ${total}</p>
                <p style="color:var(--ns-text-muted); font-size:0.9rem;">
                    ${pct >= 70 ? 'Great work! Your mastery is improving.' : 'Keep practising — each attempt builds memory.'}
                </p>
            </div>`;
        const nextBtn = document.getElementById('ns-quiz-next');
        nextBtn.textContent = 'Close';
        nextBtn.disabled = false;
        nextBtn.onclick = () => {
            modal.classList.add('hidden');
            nextBtn.onclick = null;
            nextBtn.textContent = 'Check Answer';
        };
        return;
    }

    const q = questions[idx];
    document.getElementById('ns-quiz-progress-text').textContent = `Question ${idx + 1} of ${total}`;
    document.getElementById('ns-quiz-progress-fill').style.width = `${Math.round((idx + 1) / total * 100)}%`;
    document.getElementById('ns-quiz-feedback').textContent = '';
    document.getElementById('ns-quiz-feedback').className = 'ns-quiz-feedback';

    const nextBtn = document.getElementById('ns-quiz-next');
    nextBtn.textContent = 'Check Answer';
    nextBtn.disabled = true;
    nextBtn.onclick = null;

    // Build options HTML — support array or object format from AI
    const optionEntries = Array.isArray(q.options)
        ? q.options.map((text, i) => [['A', 'B', 'C', 'D'][i], text])
        : Object.entries(q.options);

    document.getElementById('ns-quiz-body').innerHTML = `
        <h3 style="margin:0 0 20px 0; font-size:1rem; line-height:1.65; font-weight:600;">${q.question}</h3>
        <div class="ns-quiz-options">
            ${optionEntries.map(([letter, text]) => `
                <label class="ns-quiz-opt" data-letter="${letter}" style="cursor:pointer; display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:8px; border:1px solid var(--ns-sidebar-border); margin-bottom:8px; transition:background 0.15s;">
                    <input type="radio" name="ns-quiz-radio" value="${letter}" style="display:none;">
                    <span style="font-weight:700; min-width:20px; color:var(--ns-primary);">${letter}.</span>
                    <span>${text}</span>
                </label>
            `).join('')}
        </div>`;

    // Bind option clicks
    document.querySelectorAll('.ns-quiz-opt').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.ns-quiz-opt').forEach(o => {
                o.style.background = '';
                o.style.borderColor = 'var(--ns-sidebar-border)';
            });
            opt.style.background = 'var(--ns-primary)18';
            opt.style.borderColor = 'var(--ns-primary)';
            opt.querySelector('input').checked = true;

            nextBtn.disabled = false;
            nextBtn.onclick = () => _checkConceptAnswer(q, idx, total);
        });
    });
}

function _checkConceptAnswer(q, idx, total) {
    const selected = document.querySelector('input[name="ns-quiz-radio"]:checked');
    if (!selected) return;

    const feedback = document.getElementById('ns-quiz-feedback');
    const isCorrect = selected.value === q.correct;
    if (isCorrect) state.quizScore++;

    feedback.textContent = isCorrect
        ? `✓ Correct! ${q.explanation || ''}`
        : `✗ Incorrect — the answer is ${q.correct}. ${q.explanation || ''}`;
    feedback.className = `ns-quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;

    // Highlight options
    document.querySelectorAll('.ns-quiz-opt').forEach(opt => {
        const letter = opt.dataset.letter;
        if (letter === q.correct) {
            opt.style.background = 'rgba(34,197,94,0.15)';
            opt.style.borderColor = '#22c55e';
        } else if (opt.querySelector('input').checked) {
            opt.style.background = 'rgba(239,68,68,0.12)';
            opt.style.borderColor = '#ef4444';
        }
    });

    const nextBtn = document.getElementById('ns-quiz-next');
    nextBtn.textContent = idx + 1 === total ? 'Finish' : 'Next Question';
    nextBtn.onclick = () => {
        state.quizCurrentQuestion++;
        renderConceptQuizQuestion();
    };
}


/* =========================================================================
   VARK STUDY SESSION v2 — Concept-by-concept learning system
   ========================================================================= */

/* ── Rich content database ─────────────────────────────────────────────── */
const _VARK_DB = {
    'Inheritance and Polymorphism': {
        keyTerms: [
            { term: 'Inheritance', color: '#4F46E5', def: 'A child class automatically acquires all attributes and methods of a parent class. Models the "is-a" relationship.' },
            { term: 'Polymorphism', color: '#10B981', def: 'The same method name behaves differently depending on which object calls it — determined at runtime (dynamic dispatch).' },
            { term: 'Method Override', color: '#F59E0B', def: 'A child class redefines a parent method with its own version, keeping the same name but changing behavior.' },
            { term: 'super()', color: '#EC4899', def: 'Refers to the parent class. Use super().__init__() to extend parent initialization without replacing it entirely.' },
        ],
        extended: `Inheritance creates clean hierarchies: Dog IS-A Animal, SavingsAccount IS-A BankAccount. The child gets everything for free and only writes what is new or different — this prevents code duplication.\n\nPolymorphism is what makes inheritance powerful in practice. A list of Animals can hold Dogs, Cats, and Birds. Calling .speak() on each will trigger the correct version for each type automatically. Python figures this out at runtime — it is called "dynamic dispatch" or "late binding."\n\nKey exam distinction: overriding (runtime, child replaces parent method) vs overloading (compile-time, same name different parameters — Python does NOT support method overloading natively). Know this difference.`,
        audioSegments: [
            {
                title: 'What is Inheritance?',
                text: 'Inheritance lets a child class automatically get all attributes and methods of its parent. In Python, you write class Dog(Animal). Dog now has eat and name from Animal without rewriting them. You only write what is new — the speak method for example. This prevents copy-paste code and models real-world "is-a" relationships: a Dog IS an Animal, so it should have all Animal abilities.',
                question: 'How do you create a Dog class that inherits from Animal in Python?',
                options: ['class Dog extends Animal:', 'class Dog inherits Animal:', 'class Dog(Animal):', 'Dog = Animal.child()'],
                correct: 2,
                explanation: 'Python uses parentheses: class Dog(Animal):. Java uses "extends", Python uses parentheses — a common syntax trap on exams.'
            },
            {
                title: 'Polymorphism — Many Forms',
                text: 'Polymorphism means the same interface works differently for different types. If Dog and Cat both override speak from Animal, you can put them in the same list and call speak on each. Python calls Dog\'s version for Dog and Cat\'s version for Cat — automatically at runtime. You can write code that works with ANY Animal subclass without knowing which one — this is the power that makes frameworks and libraries extensible.',
                question: 'You have: animals = [Dog(), Cat()]. What does animals[1].speak() call if Cat overrides speak()?',
                options: ['Animal.speak() — always uses the parent', 'Cat.speak() — Python resolves the actual type at runtime', 'Dog.speak() — uses the first element\'s type', 'Raises AttributeError'],
                correct: 1,
                explanation: 'Python checks the actual type at runtime (dynamic dispatch). animals[1] is a Cat instance, so Cat.speak() is called — this is polymorphism.'
            },
            {
                title: 'super() and Method Override',
                text: 'Overriding replaces the parent method entirely. But if you want to EXTEND it, use super(). In __init__, call super().__init__(name) to run parent setup first, then add your child-specific attributes. Example: class Dog(Animal): def __init__(self, name, breed): super().__init__(name); self.breed = breed. This reuses parent initialization and adds the new breed attribute without duplication.',
                question: 'When should you call super().__init__() in a child class?',
                options: ['Never — it causes recursion', 'When you want to extend parent initialization and add more child-specific setup', 'Only in abstract classes', 'Only when the parent class has no attributes'],
                correct: 1,
                explanation: 'super().__init__() runs the parent constructor first, then you add child-specific code after. It extends rather than replaces parent initialization.'
            },
        ],
        lectureNotes: `<h3 style="margin:0 0 12px 0;">Inheritance</h3>
<p>Inheritance models an <strong>"is-a" relationship</strong>: a child class automatically gets all parent attributes and methods.</p>
<div class="vark-code-block">class Animal:
    def __init__(self, name):
        self.name = name
    def eat(self): print(f"{self.name} eats")

class Dog(Animal):          <span style="color:#10B981;"># Dog IS-A Animal</span>
    def __init__(self, name, breed):
        super().__init__(name)  <span style="color:#10B981;"># extend parent</span>
        self.breed = breed
    def speak(self): print(f"{self.name}: Woof!")</div>
<h4 style="margin:16px 0 8px 0;">Key Rules</h4>
<ul style="margin:0;padding-left:20px;line-height:1.8;">
  <li>Use <strong>super().__init__()</strong> to extend (not replace) parent init</li>
  <li>Child inherits ALL parent methods automatically</li>
  <li><strong>Override</strong>: redefine a method in the child class</li>
  <li>Inheritance depth: prefer shallow hierarchies (&le;3 levels)</li>
</ul>
<h3 style="margin:20px 0 12px 0;">Polymorphism</h3>
<p>Same interface, different behavior based on actual object type at runtime.</p>
<div class="vark-code-block">animals = [Dog("Rex","Lab"), Cat("Luna")]
for a in animals:
    a.speak()   <span style="color:#10B981;"># Dog.speak() then Cat.speak()</span>
                <span style="color:#10B981;"># Python decides at runtime!</span></div>
<h4 style="margin:16px 0 8px 0;">Why It Matters</h4>
<ul style="margin:0;padding-left:20px;line-height:1.8;">
  <li>Write functions that work with any subclass without modification</li>
  <li>Foundation of <strong>Open/Closed Principle</strong> (extend without modifying)</li>
  <li>Enables plugin architectures and framework extensibility</li>
</ul>`,
        activities: [
            { type: 'mcq', title: 'Identify the Relationship', prompt: 'A SavingsAccount class inherits from BankAccount and overrides withdraw() to enforce a minimum balance check. Which OOP concepts are demonstrated?', options: ['Composition and encapsulation', 'Inheritance and method overriding (polymorphism)', 'Multiple inheritance and abstraction', 'Encapsulation only'], correct: 1, explanation: 'SavingsAccount IS-A BankAccount (inheritance). It replaces withdraw() with its own version (method override). Calling withdraw() on a SavingsAccount instance calls the child\'s version — polymorphism.' },
            { type: 'code_trace', title: 'Trace the Output', prompt: 'What does this code print?\n\nclass Shape:\n    def area(self): return 0\n\nclass Circle(Shape):\n    def area(self): return 3.14\n\ns = Circle()\nprint(s.area())', options: ['0', '3.14', 'None', 'AttributeError: area not defined'], correct: 1, explanation: 'Circle overrides area(). s is a Circle instance, so Circle.area() is called (returns 3.14), not Shape.area(). Dynamic dispatch at work.' },
            { type: 'scenario', title: 'Design a Game', prompt: 'Building a game: Warrior and Mage both need health, name, level. But Warrior.attack() deals physical damage, Mage.attack() casts spells. Cleanest design?', options: ['Copy health/name/level into both Warrior and Mage — simpler and explicit', 'Warrior and Mage inherit from Character; each overrides attack()', 'Mage inherits from Warrior since both attack', 'Use plain dictionaries — no classes needed'], correct: 1, explanation: 'Inheritance: Character holds shared data. Warrior and Mage each override attack() for their own behavior. No duplication. Adding new character types (Archer, Rogue) is trivial.' },
            { type: 'edge_case', title: 'No Override — What Happens?', prompt: 'class Warrior(Character): pass\n\nWarrior has no methods. You call warrior.attack(). What happens?', options: ['AttributeError: Warrior has no attack method', 'Character.attack() is called via inheritance', 'Python creates an empty attack() automatically', 'Nothing — the call is silently ignored'], correct: 1, explanation: 'Inherited methods are available automatically. Warrior uses Character\'s attack() unless it defines its own. This is the whole point of inheritance.' },
        ]
    },

    'Object Serialization': {
        keyTerms: [
            { term: 'Serialization', color: '#4F46E5', def: 'Converting an object\'s state into bytes or text (JSON, pickle) for persistent storage or network transmission.' },
            { term: 'Deserialization', color: '#10B981', def: 'Reconstructing an object from its serialized representation back into memory.' },
            { term: 'JSON', color: '#F59E0B', def: 'Human-readable text format. Language-agnostic. Use json.dumps() to serialize and json.loads() to deserialize. Handles: str, int, float, list, dict, bool, None.' },
            { term: 'pickle', color: '#EC4899', def: 'Python-specific binary format. Serializes ANY Python object. Dangerous: never unpickle untrusted data — it can execute arbitrary code.' },
        ],
        extended: `Serialization solves a fundamental problem: how do you save an object to disk or send it over the network? In-memory objects disappear when the program ends. Serialization creates a persistent snapshot.\n\nJSON is the web standard — text-based, human-readable, and every language understands it. But it only handles basic types. Custom classes need manual conversion: json.dumps(vars(student)) converts student.__dict__ to JSON.\n\nPickle handles any Python object including complex classes and ML models. But it is Python-only and a security vulnerability — a malicious pickle payload can execute arbitrary code when deserialized. Rule: JSON for external APIs and configs, pickle for internal Python caching only, never pickle untrusted data.`,
        audioSegments: [
            {
                title: 'What is Serialization?',
                text: 'Serialization converts an in-memory object into a format you can store or transmit. Think of it as a snapshot. You have a Student object with name, grades, and courses. To save it to a file or send it to a server, you serialize it to JSON text. Later, you deserialize — reconstruct the Student from that JSON. Without serialization, all your objects disappear the moment the program ends.',
                question: 'What fundamental problem does serialization solve?',
                options: ['It makes code run faster at runtime', 'It allows object state to persist beyond program execution or be transmitted over a network', 'It encrypts sensitive user data automatically', 'It reduces memory usage during execution'],
                correct: 1,
                explanation: 'Serialization persists state (file/DB) or enables transmission (network/API). Without it, all in-memory data is lost when the program terminates.'
            },
            {
                title: 'JSON vs pickle',
                text: 'Python has two main serialization tools. json converts objects to human-readable text. It is language-agnostic — JavaScript, Java, and every other language can parse JSON. It only handles basic types though: strings, numbers, lists, dicts, booleans, and None. pickle converts any Python object to binary, including custom classes and complex data structures. But it is Python-only and carries a critical security warning: never unpickle data from an untrusted source.',
                question: 'You are building a REST API that returns user data to a JavaScript frontend. Which should you use?',
                options: ['pickle — it handles any Python object easily', 'json — it is language-agnostic and text-based, standard for web APIs', 'Both together for redundancy', 'Neither — APIs send data differently'],
                correct: 1,
                explanation: 'JSON is the universal web standard. JavaScript reads it natively. pickle is Python-specific binary that JavaScript cannot parse at all.'
            },
            {
                title: 'JSON in Practice',
                text: 'Key functions: json.dumps(obj) converts to string — the "s" stands for string. json.loads(string) converts string back to object. For files: json.dump(obj, file) writes and json.load(file) reads. For custom classes: use vars(obj) to get the __dict__ dict, then serialize that. Always wrap deserialization in try-except for malformed data. For complex objects, subclass JSONEncoder and override its default method.',
                question: 'What is the difference between json.dumps() and json.dump()?',
                options: ['They are identical — just different spellings', 'dumps returns a string; dump writes directly to a file object', 'dump is for dicts only; dumps works for all types', 'dumps is faster; dump is safer'],
                correct: 1,
                explanation: 'json.dumps() → returns a JSON string (s = string). json.dump() → writes to a file object. Same "s" vs no-"s" pattern applies to json.loads() vs json.load().'
            },
        ],
        lectureNotes: `<h3 style="margin:0 0 12px 0;">Object Serialization</h3>
<p>Converting objects to storable/transmittable formats and reconstructing them later.</p>
<h4 style="margin:0 0 8px 0; color:#F59E0B;">JSON — Human-readable (web standard)</h4>
<div class="vark-code-block">import json

data = {"name": "Alice", "grade": 85, "passed": True}

<span style="color:#10B981;"># Serialize to string</span>
json_str = json.dumps(data)    <span style="color:#6B7280;"># → '{"name":"Alice","grade":85,"passed":true}'</span>

<span style="color:#10B981;"># Deserialize from string</span>
back = json.loads(json_str)    <span style="color:#6B7280;"># → {'name':'Alice','grade':85,'passed':True}</span>

<span style="color:#10B981;"># File I/O</span>
with open('data.json', 'w') as f:
    json.dump(data, f)         <span style="color:#6B7280;"># no "s" = file</span>
with open('data.json') as f:
    loaded = json.load(f)</div>
<h4 style="margin:16px 0 8px 0; color:#EC4899;">pickle — Binary (Python-only)</h4>
<div class="vark-code-block">import pickle

bytes_data = pickle.dumps(obj)    <span style="color:#10B981;"># any Python object</span>
restored   = pickle.loads(bytes_data)

<span style="color:#ef4444;"># ⚠️ NEVER unpickle untrusted data — can execute arbitrary code</span></div>
<h4 style="margin:16px 0 8px 0;">When to Use What</h4>
<ul style="margin:0;padding-left:20px;line-height:1.8;">
  <li><strong>JSON:</strong> REST APIs, configs, cross-language, human-readable</li>
  <li><strong>pickle:</strong> internal Python caching, ML model storage</li>
  <li>JSON types: str, int, float, list, dict, bool, None only</li>
  <li>Custom class → use <code>vars(obj)</code> then json.dumps()</li>
</ul>`,
        activities: [
            { type: 'mcq', title: 'Choose the Right Tool', prompt: 'Your web API must return student records to a React frontend. What serialization do you use?', options: ['pickle — handles Python classes directly', 'json — language-agnostic, text-based, web standard', 'Both — use pickle internally, json externally', 'No serialization needed for web responses'], correct: 1, explanation: 'JSON is the web standard. React/JavaScript parses it natively. pickle produces Python-specific binary that no JavaScript runtime can decode.' },
            { type: 'code_trace', title: 'What Type is Returned?', prompt: 'import json\nresult = json.dumps({"x": 1, "y": [2, 3]})\nprint(type(result))', options: ['<class \'dict\'>', '<class \'str\'>', '<class \'bytes\'>', '<class \'list\'>'], correct: 1, explanation: 'json.dumps() returns a str (the "s" = string). The JSON text is a Python string. Compare: json.dump() (no s) writes to a file object instead.' },
            { type: 'scenario', title: 'Debug the TypeError', prompt: 'json.dumps(my_student) raises TypeError. my_student is a Student class instance. What is wrong and how do you fix it?', options: ['Python 3 does not support json.dumps for custom objects — upgrade Python', 'JSON only handles basic types. Fix: json.dumps(vars(my_student)) to get the __dict__ dict', 'Use json.dump() instead of json.dumps()', 'Add import json.extended at the top'], correct: 1, explanation: 'JSON cannot serialize custom classes. vars(obj) returns the object\'s __dict__ — a plain dict that JSON handles fine. Alternative: write a custom JSONEncoder.' },
            { type: 'security', title: 'Security Awareness', prompt: 'A developer receives a pickle file uploaded by a user and immediately runs pickle.loads(uploaded_data). What is the critical vulnerability?', options: ['Performance issue — pickle is slow for large files', 'No issue — pickle is a standard Python library, it is safe', 'Arbitrary code execution — a crafted pickle payload can run any Python code during deserialization', 'Data corruption risk only in Python 2'], correct: 2, explanation: 'pickle.loads() on untrusted input is a critical RCE (Remote Code Execution) vulnerability. A malicious pickle can trigger __reduce__ to execute any system command. Use JSON for user-supplied data.' },
        ]
    },

    'Testing & Bug Prevention': {
        keyTerms: [
            { term: 'Unit Test', color: '#4F46E5', def: 'Tests one function or class in isolation with no external dependencies. Fast (ms), specific, hundreds per suite.' },
            { term: 'TDD', color: '#10B981', def: 'Test-Driven Development: write a failing test first, then write minimum code to pass it, then refactor. Red → Green → Refactor.' },
            { term: 'Edge Case', color: '#F59E0B', def: 'Boundary or unusual inputs: empty list, None, zero, negative, maximum value. Code breaks at edges — always test them explicitly.' },
            { term: 'Code Coverage', color: '#EC4899', def: 'Percentage of lines/branches executed by tests. 80%+ is a common target. Coverage shows what ran — not whether results were correct.' },
        ],
        extended: `The testing pyramid: many fast unit tests at the base, fewer integration tests in the middle, few slow end-to-end tests at the top. Inverting this pyramid (lots of E2E, few unit tests) produces a slow, brittle, expensive suite.\n\nTDD feels unnatural until it clicks. Writing the test first forces you to think about the interface and expected behavior before touching implementation. You cannot write a vague function if you have to define exactly what input produces what output first. The Red→Green→Refactor loop provides instant feedback and builds a regression safety net as you go.\n\nCode coverage is a proxy, not a guarantee. 100% coverage with zero assertions proves nothing. The goal is meaningful assertions, not coverage numbers.`,
        audioSegments: [
            {
                title: 'Why Test? The Cost of Bugs',
                text: 'A bug found during coding costs 1 unit to fix. Found during testing: 10 units. Found in production: 100 units. Testing is not overhead — it is the cheapest quality assurance available. Unit tests run in milliseconds and give you instant feedback. Without tests, every refactor is gambling. With tests, you know in seconds whether you broke something. The investment pays back on the first saved debugging session.',
                question: 'Why is fixing bugs in production so much more expensive than during development?',
                options: ['Production servers are more expensive to operate', 'Bugs affect real users, require emergency deploys, customer support, and rollback procedures', 'The same — it is always the same effort', 'Only because developers charge more for urgent work'],
                correct: 1,
                explanation: 'Production bugs cause real user impact, require emergency response, rollback, hotfixes, customer communication, and post-mortems — all compounding costs absent in development.'
            },
            {
                title: 'Unit, Integration, and E2E Tests',
                text: 'Unit tests: test one function in isolation, mock all dependencies, run in milliseconds. Integration tests: test how two or more components interact — a service calling a real database, two APIs communicating. Slower but more realistic. End-to-end tests: test the complete user journey through the real system. Slowest, most realistic, most brittle. The testing pyramid says: base of many unit tests, middle layer of integration, tip of few E2E tests.',
                question: 'Which test type should form the LARGEST portion of your test suite?',
                options: ['End-to-end tests — they test the most realistic scenarios', 'Integration tests — they catch the most bugs', 'Unit tests — fast, isolated, hundreds per suite', 'Manual tests — nothing beats human judgment'],
                correct: 2,
                explanation: 'Unit tests are fast (ms each), highly specific, easy to maintain, and can number in the hundreds. They form the base of the testing pyramid and catch most regressions instantly.'
            },
            {
                title: 'TDD and Edge Cases',
                text: 'TDD: write a failing test first. Then write minimum code to make it pass. Then refactor. This cycle is called Red-Green-Refactor. Writing the test first forces clarity on what the function should do. Edge cases are the inputs most likely to expose bugs: empty list, None, zero, maximum integer, duplicate values, malformed strings. Always test boundaries, not just the typical happy path.',
                question: 'What is the correct TDD cycle order?',
                options: ['Design → Code → Test → Deploy', 'Code → Test → Refactor → Repeat', 'Write failing test → Write code to pass → Refactor', 'Test → Design document → Code → Test again'],
                correct: 2,
                explanation: 'TDD Red-Green-Refactor: 1) Write a failing test (Red). 2) Write minimum code to pass (Green). 3) Refactor cleanly without breaking. Never write code before you have a failing test.'
            },
        ],
        lectureNotes: `<h3 style="margin:0 0 12px 0;">Testing and Bug Prevention</h3>
<h4 style="margin:0 0 8px 0;">The Cost of Defects</h4>
<p>Development: <strong style="color:#22c55e;">1×</strong> &nbsp;|&nbsp; Testing: <strong style="color:#f59e0b;">10×</strong> &nbsp;|&nbsp; Production: <strong style="color:#ef4444;">100×</strong></p>
<h4 style="margin:16px 0 8px 0;">Unit Testing with pytest</h4>
<div class="vark-code-block"><span style="color:#6B7280;"># Source code (math_utils.py)</span>
def divide(a, b):
    if b == 0: raise ZeroDivisionError("Cannot divide by zero")
    return a / b

<span style="color:#6B7280;"># Test file (test_math_utils.py)</span>
import pytest
from math_utils import divide

def test_divide_normal():
    assert divide(10, 2) == 5.0        <span style="color:#10B981;"># happy path</span>

def test_divide_edge_zero():
    with pytest.raises(ZeroDivisionError):
        divide(10, 0)                   <span style="color:#10B981;"># edge case</span>

def test_divide_negative():
    assert divide(-6, 2) == -3.0       <span style="color:#10B981;"># boundary</span></div>
<h4 style="margin:16px 0 8px 0;">TDD — Red → Green → Refactor</h4>
<ol style="margin:0;padding-left:20px;line-height:1.9;">
  <li>🔴 Write a <strong>failing</strong> test that defines expected behavior</li>
  <li>🟢 Write <strong>minimum code</strong> to make the test pass</li>
  <li>🔵 <strong>Refactor</strong> — clean up without breaking the test</li>
</ol>
<h4 style="margin:16px 0 8px 0;">Always Test Edge Cases</h4>
<ul style="margin:0;padding-left:20px;line-height:1.8;">
  <li>Empty input: <code>[]</code>, <code>""</code>, <code>None</code></li>
  <li>Boundary values: <code>0</code>, <code>-1</code>, <code>max int</code></li>
  <li>Invalid types and malformed data</li>
  <li>Duplicate values, large inputs</li>
</ul>`,
        activities: [
            { type: 'mcq', title: 'Identify the Test Type', prompt: 'You write: assert add(2, 3) == 5. This tests one function in isolation with no external services. What test type is this?', options: ['Integration test — it tests two numbers together', 'End-to-end test — it runs the full program', 'Unit test — tests one function in isolation', 'Acceptance test — validates user requirements'], correct: 2, explanation: 'A unit test tests one function in isolation (no DB, no network, no file system). Testing add() with simple inputs is the canonical unit test.' },
            { type: 'code_trace', title: 'Find the Missing Edge Case', prompt: 'def find_max(lst): return max(lst)\n\ntest_find_max([3,1,4]) == 4 ✓\ntest_find_max([7]) == 7 ✓\n\nWhich edge case is missing?', options: ['test_find_max([0, 0]) — zero values', 'test_find_max([]) — empty list raises ValueError', 'test_find_max([1, 2, 3]) — sorted list', 'test_find_max([-1]) — negative numbers'], correct: 1, explanation: 'max([]) raises ValueError in Python. Edge case: what happens with an empty list? Your test suite must cover this. Either expect the exception or handle it explicitly.' },
            { type: 'tdd', title: 'TDD in Practice', prompt: 'Following TDD, you want to implement is_palindrome("racecar") → True. What is the FIRST thing you write?', options: ['The is_palindrome() function implementation', 'A docstring explaining what the function does', 'assert is_palindrome("racecar") == True — a failing test', 'A class diagram for the string utilities module'], correct: 2, explanation: 'TDD: test first. Write the failing assertion before any implementation. Then write minimum code to pass it. Then refactor. Never code without a failing test to guide you.' },
            { type: 'reflection', title: 'Coverage vs Quality', prompt: 'A test suite achieves 100% code coverage but every test just calls the function without any assert statements. Is this well-tested code?', options: ['Yes — 100% coverage is the gold standard and guarantees quality', 'No — tests without assertions prove nothing. Coverage measures what ran, not correctness', 'Partially — coverage still catches crashes even without assertions', 'Yes — if the code ran without errors, it is correct'], correct: 1, explanation: 'Coverage measures which lines executed — not whether results were correct. A test that calls every line but never asserts anything is security theater. Meaningful assertions are the actual value.' },
        ]
    },

    'Code Quality & Design Principles': {
        keyTerms: [
            { term: 'DRY', color: '#4F46E5', def: 'Don\'t Repeat Yourself. Every piece of knowledge should have ONE authoritative location. Duplication creates inconsistency when you update some copies but miss others.' },
            { term: 'KISS', color: '#10B981', def: 'Keep It Simple. The simplest solution that works is usually best. Complexity should be added only when the problem demands it — not in anticipation of hypothetical needs.' },
            { term: 'SOLID', color: '#F59E0B', def: 'Five OOP design principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion. Together they produce extensible, testable code.' },
            { term: 'Technical Debt', color: '#EC4899', def: 'The future cost of choosing shortcuts over clean solutions. Like financial debt, it accumulates interest — the longer you wait, the harder it is to repay.' },
        ],
        extended: `The most frequently violated SOLID principle in practice is Single Responsibility. A 500-line "God class" that validates input, processes payments, sends emails, and generates reports is impossible to test, debug, or change safely. When you find yourself writing "and" in a class or function description, it is doing too much.\n\nTechnical debt is unavoidable — delivery timelines create pressure for shortcuts. But unmanaged debt compounds: every new feature becomes harder, every bug fix risks breaking more. Track debt explicitly (comments, issue tracker), schedule paydown time, and never let it compound indefinitely.\n\nClean code is self-documenting: function names tell you what they do, class names tell you what they are responsible for. Comments should explain WHY (a business decision, a workaround for a library bug) — not WHAT (the code already shows what).`,
        audioSegments: [
            {
                title: 'DRY and KISS',
                text: 'DRY stands for Do not Repeat Yourself. Every piece of knowledge — logic, configuration, data — should have exactly one authoritative home. When requirements change, you update one place, not ten. Copy-paste code is the most common DRY violation. KISS is Keep It Simple. Do not add abstraction layers, design patterns, or extensibility for hypothetical future needs. Solve the problem you have today. You can always add complexity later when the need is proven.',
                question: 'What problem does the DRY principle specifically prevent?',
                options: ['Slow code — DRY makes algorithms faster', 'Inconsistent updates — when logic exists in one place, all callers get the same behavior', 'Security vulnerabilities — DRY prevents injection attacks', 'Memory leaks — duplicate code wastes memory'],
                correct: 1,
                explanation: 'DRY prevents inconsistency. With one source of truth, a change propagates everywhere automatically. With duplication, you update some copies and miss others — silent bugs.'
            },
            {
                title: 'SOLID — The Five Principles',
                text: 'S: Single Responsibility — a class or function has one reason to change. O: Open/Closed — open for extension through new classes, closed for modification of existing ones. L: Liskov Substitution — subclasses must be usable wherever their parent is used. I: Interface Segregation — do not force classes to implement methods they do not need. D: Dependency Inversion — depend on abstractions, not concrete implementations. SOLID principles work together: a class that does one thing is easy to extend, easy to test, and easy to replace.',
                question: 'A UserService class handles login, registration, email sending, and database queries. Which principle is MOST violated?',
                options: ['Open/Closed — it cannot be extended', 'Single Responsibility — it has four different reasons to change', 'Liskov Substitution — it cannot be subclassed', 'Dependency Inversion — it depends on concretions'],
                correct: 1,
                explanation: 'Single Responsibility: a class should have ONE reason to change. UserService has four — any concern change forces edits. Split: AuthService, EmailService, UserRepository.'
            },
            {
                title: 'Recognizing Bad Code',
                text: 'Red flags: functions longer than 20 lines (likely doing too much), variable names like x, temp, or data (meaningless), magic numbers like 86400 instead of SECONDS_IN_DAY, deeply nested if statements more than 3 levels, copy-pasted blocks. Comments that explain WHAT code does are a code smell — the code should be clear enough to not need them. Comments that explain WHY are valuable — business decisions, known tradeoffs, workarounds.',
                question: 'Which of these is the clearest code smell (sign of poor quality)?',
                options: ['A function named calculate_compound_interest()', 'float x = total_outstanding_balance — using x as variable name', 'A class named BankAccount with only account-related methods', 'Tests covering negative and zero input edge cases'],
                correct: 1,
                explanation: 'x as a variable name for financial data is meaningless. Good: total_outstanding_balance. Code that requires comments to explain variable names has already failed readability.'
            },
        ],
        lectureNotes: `<h3 style="margin:0 0 12px 0;">Code Quality Principles</h3>
<h4 style="margin:0 0 8px 0; color:#4F46E5;">DRY — Don't Repeat Yourself</h4>
<div class="vark-code-block"><span style="color:#ef4444;"># ❌ BAD — magic number duplicated 3 times</span>
def late_fee(days):    return days * 0.05
def fine(days):        return days * 0.05
def penalty(days):     return days * 0.05

<span style="color:#10B981;"># ✅ GOOD — one source of truth</span>
DAILY_RATE = 0.05
def late_fee(days):    return days * DAILY_RATE
def fine(days):        return days * DAILY_RATE</div>
<h4 style="margin:16px 0 8px 0; color:#F59E0B;">SOLID Principles</h4>
<ul style="margin:0;padding-left:20px;line-height:1.9;">
  <li><strong>S</strong>ingle Responsibility: one class = one reason to change</li>
  <li><strong>O</strong>pen/Closed: extend with new classes, don't modify existing</li>
  <li><strong>L</strong>iskov Substitution: subclasses usable in place of parent</li>
  <li><strong>I</strong>nterface Segregation: no forced unused method implementations</li>
  <li><strong>D</strong>ependency Inversion: depend on abstractions, not concretions</li>
</ul>
<h4 style="margin:16px 0 8px 0;">Clean Code Checklist</h4>
<ul style="margin:0;padding-left:20px;line-height:1.8;">
  <li>Functions: one job, verb name, &lt;20 lines</li>
  <li>Variables: descriptive nouns, no magic numbers</li>
  <li>No copy-paste blocks — extract functions</li>
  <li>Nesting depth &le; 3 levels</li>
  <li>Comments explain WHY, not WHAT</li>
</ul>`,
        activities: [
            { type: 'mcq', title: 'Spot the Violation', prompt: 'process_order() validates input, calculates discounts, sends confirmation email, saves to database, and generates PDF receipt. Which SOLID principle is most violated?', options: ['Open/Closed — it cannot be extended', 'Single Responsibility — it has 5 different responsibilities', 'Liskov Substitution — it should be overridable', 'Interface Segregation — it exposes too many methods'], correct: 1, explanation: 'Single Responsibility: one function should have ONE reason to change. This function has five. Split: validate_order(), calculate_discount(), send_confirmation(), save_order(), generate_receipt().' },
            { type: 'refactor', title: 'Apply DRY', prompt: 'Identify the DRY violation:\n\ndef circle_area(r):   return 3.14159 * r * r\ndef circumference(r): return 2 * 3.14159 * r\ndef sphere_vol(r):    return (4/3) * 3.14159 * r**3', options: ['No violation — all functions serve different purposes', 'The magic number 3.14159 appears 3 times — define PI = 3.14159 once and reference it', 'The variable r is repeated — should be renamed', 'The functions should be merged into one'], correct: 1, explanation: 'DRY: 3.14159 repeated 3 times is a knowledge duplication. Define PI = 3.14159 (or use math.pi) and reference it everywhere. One change updates all three.' },
            { type: 'design', title: 'Apply Open/Closed', prompt: 'EmailNotifier sends emails. Now you need SMS and Push notifications too. What is the SOLID-compliant solution?', options: ['Add send_sms() and send_push() methods to EmailNotifier — everything in one place', 'Create a Notifier abstract base class. EmailNotifier, SMSNotifier, PushNotifier each implement it independently', 'Duplicate EmailNotifier for SMS and Push', 'Add if/elif inside EmailNotifier to handle all three types'], correct: 1, explanation: 'Open/Closed + Single Responsibility: EmailNotifier does one thing. Create a Notifier interface. New types extend it — existing code never changes. Adding new channels is trivial.' },
            { type: 'debt', title: 'Technical Debt Decision', prompt: 'A 600-line function from 3 years ago: it works but nobody understands it and there are no tests. A new feature requires modifying it. What is the safest approach?', options: ['Refactor the entire function immediately before touching it', 'Delete it and rewrite from scratch — clean slate is always better', 'Add characterization tests to capture current behavior first, then refactor incrementally with tests as a safety net', 'Leave it exactly as-is — if it works, never touch it'], correct: 2, explanation: 'Golden master / characterization testing: capture current behavior with tests first. This gives you a safety net. Then refactor in small steps. Deleting and rewriting without tests creates new bugs.' },
        ]
    },
};

/* Template content generator for concepts not in _VARK_DB */
function _getConceptContent(concept) {
    if (_VARK_DB[concept.name]) return _VARK_DB[concept.name];
    const n = concept.name, wt = Math.round(concept.exam_weightage * 100), d = concept.difficulty || 'medium';
    const studyMins = d === 'hard' ? 90 : d === 'medium' ? 60 : 40;
    return {
        keyTerms: [
            { term: n, color: '#4F46E5', def: `Core topic with ${wt}% exam weight. Difficulty: ${d}. Master both theory and application.` },
            { term: 'Definition', color: '#10B981', def: `The precise meaning of "${n}" — exams test whether you can define it clearly and correctly.` },
            { term: 'Application', color: '#F59E0B', def: `How "${n}" is used in real scenarios. Exams often present novel situations requiring you to apply the concept.` },
            { term: 'Common Errors', color: '#EC4899', def: `Typical misconceptions and mistakes students make with "${n}". Know these to avoid them.` },
        ],
        extended: `"${n}" carries ${wt}% exam weight — it is a primary concept worth focused study time.\n\nTo master it: (1) Understand the precise definition. (2) Study worked examples from lectures. (3) Practice applying it to new problems. (4) Connect it to related concepts — this shows higher-order understanding.\n\nRecommended study time: ${studyMins} minutes. Focus on active recall, not passive re-reading.`,
        audioSegments: [
            { title: `Introduction to ${n}`, text: `"${n}" is a ${d}-level concept carrying ${wt}% of your exam weight. Let us break it down. Start with the core definition — what exactly is "${n}"? Then understand why it exists: what problem does it solve, or what does it enable? Knowing the "why" helps you apply the concept to questions you have never seen before, which is what exams test.`, question: `What is the most important reason to master "${n}"?`, options: [`It carries ${wt}% exam weight — high direct score impact`, 'It is the easiest topic in the course', 'It only appears in bonus questions', 'It has no connection to other topics'], correct: 0, explanation: `${wt}% exam weight means mastering "${n}" could directly improve your score by up to ${wt} points. Always prioritize high-weight concepts.` },
            { title: `Applying ${n}`, text: `Now let us think about how "${n}" is applied in practice. Real application is always tested — not just definitions. Ask yourself: when would you use this? What are the inputs and outputs? What can go wrong? What are the edge cases? The gap between "I understand this conceptually" and "I can answer exam questions about it" is closed through deliberate practice with worked examples and past papers.`, question: `Which activity is MOST effective for building genuine mastery of "${n}"?`, options: ['Re-reading the definition multiple times', 'Watching videos about it passively', 'Attempting practice problems and carefully reviewing every mistake', 'Memorizing bullet points from a summary sheet'], correct: 2, explanation: 'Active retrieval practice — working problems and analyzing errors — is the highest-impact study method. Passive review creates the illusion of understanding without the substance.' },
        ],
        lectureNotes: `<h3 style="margin:0 0 12px 0;">${n}</h3>
<p>Exam weight: <strong style="color:var(--ns-primary);">${wt}%</strong> &nbsp;|&nbsp; Difficulty: <strong>${d}</strong> &nbsp;|&nbsp; Recommended: <strong>${studyMins} min</strong></p>
<h4 style="margin:16px 0 8px 0;">Overview</h4>
<p>This is a core concept with direct exam impact. Focus on both definition and practical application.</p>
<h4 style="margin:16px 0 8px 0;">Study Strategy</h4>
<ol style="margin:0;padding-left:20px;line-height:1.9;">
  <li>Read the precise definition from lecture notes</li>
  <li>Study 2–3 worked examples</li>
  <li>Attempt practice problems without notes first</li>
  <li>Review mistakes — understand WHY each error occurred</li>
  <li>Connect to prerequisite and related concepts</li>
</ol>
<h4 style="margin:16px 0 8px 0;">Exam Tips</h4>
<ul style="margin:0;padding-left:20px;line-height:1.8;">
  <li>Expect definition AND application questions</li>
  <li>Practice with past exam papers for this topic</li>
  <li>Understand common misconceptions to avoid them</li>
</ul>`,
        activities: [
            { type: 'mcq', title: 'Core Understanding', prompt: `Which statement best describes the role of "${n}" in this course?`, options: [`A ${d}-difficulty foundational concept with ${wt}% exam weight — worth mastering thoroughly`, 'Optional supplementary material not on exams', 'Only relevant to advanced research topics', 'A concept with no practical application'], correct: 0, explanation: `"${n}" has ${wt}% exam weight — that is direct score impact. It is a primary concept, not optional reading.` },
            { type: 'mcq', title: 'Study Approach', prompt: `You scored 40% on a practice question about "${n}". What is the most effective next step?`, options: ['Re-read the lecture notes immediately', 'Find the specific sub-concept you got wrong, study only that, then attempt another question', 'Move on — come back in a week', 'Study a different topic first to build confidence'], correct: 1, explanation: 'Targeted practice: identify the specific error, address exactly that gap, then test again immediately. Generic re-reading spreads effort across what you already know.' },
            { type: 'scenario', title: 'Apply the Concept', prompt: `A student understands "${n}" from lectures but cannot answer exam questions about it. What is the root cause?`, options: ['The student needs more lecture time', 'Recognition ≠ recall. They can follow an explanation but cannot generate one. Fix: active practice, not passive review.', 'The exam questions are unfair', 'The student needs to read the textbook instead'], correct: 1, explanation: 'Recognition (understanding when shown) and recall (generating from memory) are different cognitive skills. Exams test recall. Build it through active retrieval practice.' },
            { type: 'reflection', title: 'Self-Assessment', prompt: `Rate your current honest mastery of "${n}":`, options: ['I can define it but get confused on application questions', 'I can solve standard practice problems reliably', 'I can solve novel/unfamiliar problems confidently', 'I need to revisit the definition — not solid on basics yet'], correct: -1, explanation: 'Honest self-assessment drives smart study. If you answered A or D, prioritize this topic. If B, push toward C with harder practice questions. If C, maintain with weekly review.' },
        ]
    };
}

/* ── Session state variables ──────────────────────────────────────────────── */
let _varkAudioSeg   = 0;   // current audio segment index
let _varkAudioAns   = [];  // answers given per segment [true/false/null]
let _varkKineticAct = 0;   // current kinesthetic activity index
let _varkKineticAns = [];  // answers per activity [true/false/null]

/* ── Course / mode navigation ─────────────────────────────────────────────── */

function openVARKSession(courseId) {
    state.activeVARKCourseId = courseId;
    const course = state.courses.find(c => c.id === courseId);
    const payload = courseAnalyticsData[courseId];

    if (course) {
        document.getElementById('vark-course-code').textContent = course.code;
        document.getElementById('vark-course-title').textContent = course.title;
        document.getElementById('ns-page-title').textContent = course.code;
    }
    const masteryEl = document.getElementById('vark-course-mastery');
    const attnEl    = document.getElementById('vark-course-attention');
    if (payload && payload.concepts && payload.concepts.length > 0) {
        const ann = payload.concepts.map(annotate);
        const m   = Math.round(computeWeightedMastery(ann) * 100);
        const a   = ann.filter(c => c.flags.requiresAttention).length;
        if (masteryEl) masteryEl.textContent = m + '% mastery';
        if (attnEl) { attnEl.textContent = a > 0 ? a + ' concept' + (a !== 1 ? 's' : '') + ' need attention' : 'All concepts on track ✓'; attnEl.style.color = a > 0 ? 'var(--ns-danger)' : 'var(--ns-success,#22c55e)'; }
    } else {
        if (masteryEl) masteryEl.textContent = 'No data yet';
        if (attnEl)    { attnEl.textContent = 'Connect with NTU Learn to load course data'; attnEl.style.color = 'var(--ns-text-muted)'; }
    }
    const fileList = document.getElementById('vark-uploaded-files');
    if (fileList) fileList.innerHTML = '';
    document.querySelectorAll('#ns-nav-default .ns-nav-item').forEach(n => n.classList.remove('active'));
    switchTab('view-vark');
}

function selectVARKMode(mode) {
    state.activeVARKMode = mode;
    const course = state.courses.find(c => c.id === state.activeVARKCourseId);
    const modeLabels = { visual:'Visual', auditory:'Auditory', reading:'Reading / Writing', kinesthetic:'Kinesthetic' };
    const badgeCls   = { visual:'vark-badge-visual', auditory:'vark-badge-auditory', reading:'vark-badge-reading', kinesthetic:'vark-badge-kinesthetic' };

    const badge = document.getElementById('vark-mode-badge');
    if (badge) { badge.textContent = modeLabels[mode] || mode; badge.className = 'vark-mode-badge ' + (badgeCls[mode] || 'vark-badge-visual'); }
    const titleEl = document.getElementById('vark-session-title');
    if (titleEl && course) titleEl.textContent = course.code + ': ' + course.title;

    if (!state.varkProgress) state.varkProgress = {};
    if (!state.varkContentCache) state.varkContentCache = {};
    const cid = state.activeVARKCourseId;
    if (!state.varkProgress[cid]) state.varkProgress[cid] = {};
    state.varkSession = { courseId: cid, mode, currentConceptIdx: 0 };
    _varkAudioSeg = 0; _varkAudioAns = []; _varkKineticAct = 0; _varkKineticAns = [];

    document.getElementById('ns-page-title').textContent = (course ? course.code : '') + ' · ' + modeLabels[mode];
    switchTab('view-vark-session');
    _renderCurrentVARKConcept();   // async — fires and runs
}

/* ── Concept rendering (async — calls OpenAI API) ─────────────────────────── */

function _varkConcepts() {
    const s = state.varkSession || {};
    return (courseAnalyticsData[s.courseId] && courseAnalyticsData[s.courseId].concepts) || [];
}

async function _renderCurrentVARKConcept() {
    const s        = state.varkSession || {};
    const concepts = _varkConcepts();
    const concept  = concepts[s.currentConceptIdx];
    if (!concept) return;

    // Immediate UI updates (no async needed)
    _renderVARKConceptNav(concepts, s.currentConceptIdx, s.courseId, s.mode);
    const prog = state.varkProgress[s.courseId] || {};
    const done = concepts.filter(c => (prog[c.id] || {})[s.mode]).length;
    const compEl = document.getElementById('vark-session-completion');
    if (compEl) compEl.textContent = done + ' / ' + concepts.length + ' complete';
    const prevBtn = document.getElementById('vark-prev-btn');
    const nextBtn = document.getElementById('vark-next-btn');
    const ctr     = document.getElementById('vark-concept-counter');
    if (prevBtn) prevBtn.disabled = s.currentConceptIdx === 0;
    if (nextBtn) { nextBtn.innerHTML = s.currentConceptIdx === concepts.length - 1
        ? 'Finish <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>'
        : 'Next Concept <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>'; }
    if (ctr) ctr.textContent = 'Concept ' + (s.currentConceptIdx + 1) + ' of ' + concepts.length;

    const container = document.getElementById('vark-session-content');
    if (!container) return;

    // Check content cache
    if (!state.varkContentCache) state.varkContentCache = {};
    const cacheKey = s.courseId + '_' + concept.id + '_' + s.mode;

    if (!state.varkContentCache[cacheKey]) {
        // Show loading spinner immediately
        container.innerHTML = _buildVARKLoadingHTML(concept.name, s.mode);
        // Fetch content from OpenAI API (with static fallback)
        state.varkContentCache[cacheKey] = await _fetchVARKContent(concept, s.mode, s.courseId);
    }

    const content = state.varkContentCache[cacheKey];

    // Guard: no content source available
    if (content && content._noContent) {
        container.innerHTML = _buildVARKNoContentHTML(s.courseId);
        return;
    }

    // Render mode-specific content
    if      (s.mode === 'visual')      { container.innerHTML = _renderVisualConcept(concept, content, s.courseId); }
    else if (s.mode === 'auditory')    { container.innerHTML = _renderAudioConcept(concept, content); }
    else if (s.mode === 'reading')     { container.innerHTML = _renderReadingConcept(concept, content, s.courseId); }
    else if (s.mode === 'kinesthetic') { container.innerHTML = _renderKineticConcept(concept, content); }

    // Pre-fetch next concept silently in background
    const nextIdx = s.currentConceptIdx + 1;
    if (nextIdx < concepts.length) {
        const next    = concepts[nextIdx];
        const nextKey = s.courseId + '_' + next.id + '_' + s.mode;
        if (!state.varkContentCache[nextKey]) {
            _fetchVARKContent(next, s.mode, s.courseId)
                .then(c => { state.varkContentCache[nextKey] = c; })
                .catch(() => {});
        }
    }
}

/**
 * Returns true if the course has usable content (PDF or user-uploaded files).
 * If neither exists, VARK content generation should be blocked.
 */
function _courseHasContent(courseId) {
    const payload = courseAnalyticsData[courseId];
    // 1. Course has a known PDF source
    if (payload && payload.pdfSource) return true;
    // 2. User uploaded files for this course in the current session
    const uploadContainer = document.getElementById('vark-uploaded-files');
    if (uploadContainer && uploadContainer.children.length > 0) return true;
    return false;
}

/** Fetch VARK content from the API. Blocks generation if no content source exists. */
async function _fetchVARKContent(concept, mode, courseId) {
    // Guard: no PDF and no uploaded files → cannot generate
    if (!_courseHasContent(courseId)) {
        return { _noContent: true };
    }

    const payload   = courseAnalyticsData[courseId];
    const course    = state.courses.find(c => c.id === courseId);
    const pdfSource = payload ? (payload.pdfSource || null) : null;

    try {
        const res = await fetch('http://localhost:8000/vark/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                course_code:  course ? course.code  : '',
                course_name:  course ? course.title : '',
                concept_name: concept.name,
                mode,
                pdf_source:   pdfSource,
            }),
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        return _normalizeVARKContent(data, mode, concept);
    } catch (err) {
        console.warn('[VARK] API unavailable — using static fallback for', concept.name, '/', mode, ':', err.message);
        return _getConceptContent(concept);
    }
}

/** Map API response keys → renderer-expected keys. */
function _normalizeVARKContent(apiData, mode, concept) {
    if (!apiData) return _getConceptContent(concept);
    try {
        if (mode === 'visual') {
            return {
                keyTerms:           (apiData.key_terms || apiData.keyTerms || []),
                extended:           (apiData.extended || apiData.extended_explanation || ''),
                conceptConnections: (apiData.concept_connections || []),
            };
        } else if (mode === 'auditory') {
            const segs = apiData.segments || apiData.audioSegments || [];
            // Ensure each segment has required fields
            return { audioSegments: segs.map(seg => ({
                title:       seg.title       || 'Audio Segment',
                text:        seg.text        || '',
                question:    seg.question    || '',
                options:     seg.options     || [],
                correct:     typeof seg.correct === 'number' ? seg.correct : 0,
                explanation: seg.explanation || '',
            }))};
        } else if (mode === 'reading') {
            return { lectureNotes: (apiData.lecture_html || apiData.lectureNotes || '') };
        } else if (mode === 'kinesthetic') {
            const acts = apiData.activities || [];
            return { activities: acts.map(a => ({
                type:        a.type        || 'mcq',
                title:       a.title       || 'Activity',
                prompt:      a.prompt      || '',
                options:     a.options     || [],
                correct:     typeof a.correct === 'number' ? a.correct : 0,
                explanation: a.explanation || '',
            }))};
        }
    } catch (_) {}
    return _getConceptContent(concept);
}

/** Loading spinner shown while API call is in progress. */
function _buildVARKLoadingHTML(conceptName, mode) {
    const labels = { visual:'Comprehensive Visual Notes', auditory:'Detailed Audio Script', reading:'Structured Lecture Notes', kinesthetic:'Hands-on Activities' };
    const descs  = { visual:'Generating colour-coded key terms + deep explanation', auditory:'Writing detailed spoken-style learning segments', reading:'Transforming PDF into structured lecture notes', kinesthetic:'Building activities tied directly to the PDF' };
    return `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:340px;gap:20px;padding:48px 24px;">
        <div class="vark-spinner"></div>
        <div style="text-align:center;max-width:340px;">
            <p style="font-weight:700;font-size:1.05rem;margin:0 0 8px 0;color:var(--ns-text-main);">Generating ${labels[mode] || 'Content'}</p>
            <p style="color:var(--ns-primary);font-size:0.9rem;font-weight:600;margin:0 0 8px 0;">${conceptName}</p>
            <p style="color:var(--ns-text-muted);font-size:0.82rem;margin:0;line-height:1.5;">${descs[mode] || 'Using AI + PDF materials'} …</p>
        </div>
    </div>`;
}

/** Shown when a course has no PDF and no uploaded files. */
function _buildVARKNoContentHTML(courseId) {
    const payload = courseAnalyticsData[courseId];
    const code    = payload ? payload.code  : 'this course';
    const name    = payload ? payload.name  : '';
    return `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:340px;gap:20px;padding:48px 24px;text-align:center;">
        <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="1.5" fill="none" style="color:var(--ns-text-muted);">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
        </svg>
        <div style="max-width:400px;">
            <h4 style="margin:0 0 10px 0;font-size:1.1rem;">No Course Materials Found</h4>
            <p style="color:var(--ns-text-muted);font-size:0.9rem;margin:0 0 6px 0;line-height:1.6;">
                <strong>${code}${name ? ' — ' + name : ''}</strong> has no PDF connected and no uploaded files.
            </p>
            <p style="color:var(--ns-text-muted);font-size:0.88rem;margin:0 0 20px 0;line-height:1.6;">
                VARK content cannot be generated without course material. Please upload your notes, slides, or lecture PDFs first.
            </p>
            <button class="ns-btn-primary" onclick="switchTab('view-vark')" style="display:inline-flex;align-items:center;gap:8px;">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Upload Materials &amp; Try Again
            </button>
        </div>
    </div>`;
}

function _renderVARKConceptNav(concepts, currentIdx, courseId, mode) {
    const nav  = document.getElementById('vark-concept-nav');
    if (!nav) return;
    const prog = (state.varkProgress && state.varkProgress[courseId]) || {};
    nav.innerHTML = concepts.map((c, i) => {
        const done = (prog[c.id] || {})[mode];
        const pct  = Math.round(c.mastery * 100);
        const col  = pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444';
        return `<button class="vark-nav-pill ${i === currentIdx ? 'active' : ''} ${done ? 'done' : ''}"
            onclick="varkGoToConcept(${i})" title="${c.name} — ${pct}% mastery">
            ${done ? '<svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg> ' : ''}${i + 1}. ${c.name.length > 22 ? c.name.slice(0, 20) + '…' : c.name}
            <span style="color:${col};font-size:0.7rem;font-weight:700;margin-left:4px;">${pct}%</span>
        </button>`;
    }).join('');
}

async function varkGoToConcept(idx) {
    const s = state.varkSession || {};
    s.currentConceptIdx = idx;
    state.varkSession   = s;
    _varkAudioSeg = 0; _varkAudioAns = []; _varkKineticAct = 0; _varkKineticAns = [];
    await _renderCurrentVARKConcept();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevVARKConcept() {
    const s = state.varkSession || {};
    if (s.currentConceptIdx > 0) varkGoToConcept(s.currentConceptIdx - 1);
}

function nextVARKConcept() {
    const s        = state.varkSession || {};
    const concepts = _varkConcepts();
    if (s.currentConceptIdx < concepts.length - 1) {
        varkGoToConcept(s.currentConceptIdx + 1);
    } else {
        const done = concepts.filter(c => ((state.varkProgress[s.courseId] || {})[c.id] || {})[s.mode]).length;
        if (done < concepts.length) {
            const ml = { visual:'Visual', auditory:'Auditory', reading:'Reading / Writing', kinesthetic:'Kinesthetic' };
            alert(`You have completed ${done} of ${concepts.length} concepts in ${ml[s.mode]} mode.\n\nYou can still return and complete the remaining concepts anytime.`);
        }
        switchTab('view-vark');
        document.getElementById('ns-page-title').textContent = document.getElementById('vark-course-code').textContent;
    }
}


function _markVARKComplete(conceptId) {
    const s   = state.varkSession || {};
    const cid = s.courseId, mode = s.mode;
    if (!state.varkProgress[cid]) state.varkProgress[cid] = {};
    if (!state.varkProgress[cid][conceptId]) state.varkProgress[cid][conceptId] = {};
    state.varkProgress[cid][conceptId][mode] = true;
    // Re-render nav to show checkmark
    _renderVARKConceptNav(_varkConcepts(), s.currentConceptIdx, cid, mode);
    const prog = state.varkProgress[cid] || {};
    const done = _varkConcepts().filter(c => (prog[c.id] || {})[mode]).length;
    const compEl = document.getElementById('vark-session-completion');
    if (compEl) compEl.textContent = done + ' / ' + _varkConcepts().length + ' complete';
}

function _updateConceptMastery(courseId, conceptId, delta) {
    const payload = courseAnalyticsData[courseId];
    if (!payload) return;
    const concept = (payload.concepts || []).find(c => c.id === conceptId);
    if (!concept) return;
    concept.mastery = Math.min(0.95, Math.max(0.05, concept.mastery + delta));
    // Re-render course cards to reflect update
    renderNsAppCourses();
}

/* ══════════════════════════════════════════════════════════════════════════
   VISUAL MODE
══════════════════════════════════════════════════════════════════════════ */

function _renderVisualConcept(concept, content, courseId) {
    const pct   = Math.round(concept.mastery * 100);
    const color = pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444';
    const circ  = 2 * Math.PI * 28;
    const off   = circ * (1 - pct / 100);
    const prog  = (state.varkProgress && state.varkProgress[courseId] || {});
    const done  = (prog[concept.id] || {}).visual;

    const keyTermsHtml = content.keyTerms.map(kt => `
        <div class="vark-key-term-card" style="border-left:4px solid ${kt.color};">
            <div style="font-weight:700; font-size:0.95rem; color:${kt.color}; margin-bottom:6px;">${kt.term}</div>
            <p style="margin:0; font-size:0.85rem; line-height:1.6; color:var(--ns-text-main);">${kt.def}</p>
        </div>`).join('');

    const prereqs = (concept.prerequisites || []).map(pid => {
        const concepts = _varkConcepts();
        const p = concepts.find(c => c.id === pid);
        return p ? p.name : pid;
    });

    return `
    <div>
        <!-- Concept header card -->
        <div class="ns-card vark-visual-hero">
            <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap;">
                <div style="flex:1; min-width:200px;">
                    <div style="display:flex; gap:8px; align-items:center; margin-bottom:8px; flex-wrap:wrap;">
                        ${difficultyBadge(concept.difficulty)} ${statusBadge({ flags: annotate(concept).flags })}
                        <span style="font-size:0.78rem; color:var(--ns-text-muted);">Exam weight: <strong style="color:var(--ns-text-main);">${Math.round(concept.exam_weightage * 100)}%</strong></span>
                    </div>
                    <h3 style="margin:0 0 10px 0; font-size:1.2rem;">${concept.name}</h3>
                    ${prereqs.length > 0 ? `<div style="font-size:0.8rem; color:var(--ns-text-muted);">Requires: ${prereqs.map(n=>`<span style="background:var(--ns-bg);border-radius:4px;padding:2px 8px;margin-right:4px;display:inline-block;">${n}</span>`).join('')}</div>` : ''}
                </div>
                <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                    <svg width="72" height="72" viewBox="0 0 72 72">
                        <circle cx="36" cy="36" r="28" fill="none" stroke="var(--ns-sidebar-border)" stroke-width="7"/>
                        <circle cx="36" cy="36" r="28" fill="none" stroke="${color}" stroke-width="7"
                            stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"
                            stroke-linecap="round" transform="rotate(-90 36 36)"/>
                        <text x="36" y="41" text-anchor="middle" font-size="14" font-weight="700" fill="${color}">${pct}%</text>
                    </svg>
                    <span style="font-size:0.72rem; color:var(--ns-text-muted); font-weight:600;">YOUR MASTERY</span>
                </div>
            </div>
        </div>

        <!-- Key terms grid -->
        <div style="margin-bottom:20px;">
            <h4 style="margin:0 0 12px 0; font-size:0.88rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--ns-text-muted);">Key Terms — Colour Coded</h4>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:12px;">${keyTermsHtml}</div>
        </div>

        <!-- Extended AI explanation -->
        <div class="ns-card" style="padding:24px; margin-bottom:20px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" style="color:var(--ns-primary);flex-shrink:0;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <h4 style="margin:0;">AI-Generated Deep Dive</h4>
                <span style="font-size:0.72rem;color:var(--ns-text-muted);margin-left:auto;">Powered by GPT-4o + PDF</span>
            </div>
            <div style="font-size:0.9rem; line-height:1.8; white-space:pre-line; color:var(--ns-text-main);">${content.extended}</div>
        </div>

        ${(content.conceptConnections && content.conceptConnections.length > 0) ? `
        <!-- Concept connections (from API) -->
        <div class="ns-card" style="padding:22px; margin-bottom:20px;">
            <h4 style="margin:0 0 14px 0; display:flex;align-items:center;gap:8px;">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                Concept Connections
            </h4>
            <div style="display:flex;flex-wrap:wrap;gap:10px;">
                ${content.conceptConnections.map(cc => `
                <div style="padding:10px 14px;border-radius:10px;border:1px solid var(--ns-sidebar-border);background:var(--ns-bg);flex:1;min-width:180px;">
                    <div style="font-weight:700;font-size:0.88rem;margin-bottom:4px;">${cc.name || ''}</div>
                    <div style="font-size:0.8rem;color:var(--ns-text-muted);">${cc.relationship || ''}</div>
                </div>`).join('')}
            </div>
        </div>` : ''}

        <!-- Mark complete -->
        <div style="display:flex; justify-content:flex-end; margin-bottom:8px;">
            ${done
                ? `<div style="display:flex;align-items:center;gap:8px;color:#22c55e;font-weight:600;font-size:0.9rem;"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg> Reviewed</div>`
                : `<button class="ns-btn-primary" onclick="_markVARKComplete('${concept.id}')" style="display:flex;align-items:center;gap:8px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Mark as Reviewed
                   </button>`
            }
        </div>
    </div>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   AUDIO MODE
══════════════════════════════════════════════════════════════════════════ */

function _renderAudioConcept(concept, content) {
    const segs  = content.audioSegments || [];
    const total = segs.length;
    const seg   = segs[_varkAudioSeg] || segs[0];
    if (!seg) return '<p style="color:var(--ns-text-muted);">No audio content available.</p>';
    return _buildAudioSegmentHTML(concept, seg, _varkAudioSeg, total, content);
}

function _buildAudioSegmentHTML(concept, seg, segIdx, total, content) {
    const answered  = _varkAudioAns[segIdx] !== undefined;
    const correct   = _varkAudioAns[segIdx] === true;
    const isLast    = segIdx === total - 1;
    const allDone   = _varkAudioAns.filter(a => a !== undefined).length === total;
    const correctCt = _varkAudioAns.filter(a => a === true).length;
    const prog      = (state.varkProgress && (state.varkProgress[state.varkSession.courseId] || {}));
    const done      = (prog[concept.id] || {}).auditory;

    const optionsHtml = seg.options.map((opt, i) => {
        let bg = '', bc = 'var(--ns-sidebar-border)', tc = 'var(--ns-text-main)';
        if (answered) {
            if (i === seg.correct)                         { bg = 'rgba(34,197,94,0.12)'; bc = '#22c55e'; }
            else if (_varkAudioAns[segIdx + '_sel'] === i) { bg = 'rgba(239,68,68,0.1)';  bc = '#ef4444'; }
        }
        return `<div class="vark-audio-opt ${answered ? 'locked' : ''}" data-idx="${i}"
            style="padding:11px 16px; border-radius:10px; border:1.5px solid ${bc}; background:${bg}; color:${tc}; cursor:${answered ? 'default' : 'pointer'}; margin-bottom:8px; display:flex; align-items:center; gap:10px; transition:border-color 0.15s, background 0.15s;"
            ${!answered ? `onclick="varkAudioSelectOpt(${i})"` : ''}>
            <span style="font-weight:700; color:${answered && i === seg.correct ? '#22c55e' : 'var(--ns-primary)'}; min-width:20px;">${['A','B','C','D'][i]}.</span>
            <span>${opt}</span>
        </div>`;
    }).join('');

    const feedbackHtml = answered ? `
        <div style="padding:12px 16px; border-radius:10px; margin-top:4px; margin-bottom:16px; background:${correct ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)'}; border:1px solid ${correct ? '#22c55e44' : '#ef444444'};">
            <span style="font-weight:700; color:${correct ? '#22c55e' : '#ef4444'};">${correct ? '✓ Correct!' : '✗ Not quite.'}</span>
            <span style="font-size:0.88rem; color:var(--ns-text-main); margin-left:8px;">${seg.explanation}</span>
        </div>` : '';

    return `
    <div>
        <!-- Progress bar for segments -->
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:18px;">
            ${Array.from({length: total}, (_, i) => `
                <div style="flex:1; height:4px; border-radius:4px; background:${i < _varkAudioSeg ? '#22c55e' : i === _varkAudioSeg ? 'var(--ns-primary)' : 'var(--ns-sidebar-border)'}; cursor:pointer;" onclick="varkAudioGoSeg(${i})"></div>
            `).join('')}
            <span style="font-size:0.8rem; color:var(--ns-text-muted); white-space:nowrap;">${segIdx + 1} / ${total}</span>
        </div>

        <!-- Segment card -->
        <div class="ns-card" style="padding:24px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
                <div>
                    <div style="font-size:0.75rem; font-weight:700; color:var(--ns-primary); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px;">Segment ${segIdx + 1} of ${total}</div>
                    <h4 style="margin:0; font-size:1.05rem;">${seg.title}</h4>
                </div>
                <button class="vark-tts-btn" id="vark-tts-btn" onclick="varkSpeakSeg(this)" data-text="${seg.text.replace(/"/g, '&quot;')}">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                    </svg>
                    Listen
                </button>
            </div>
            <p style="margin:0; font-size:0.9rem; line-height:1.75; color:var(--ns-text-main); border-left:3px solid var(--ns-primary); padding-left:14px;">${seg.text}</p>
        </div>

        <!-- Comprehension question -->
        <div class="ns-card" style="padding:24px; margin-bottom:16px;">
            <div style="font-size:0.75rem; font-weight:700; color:var(--ns-text-muted); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:10px;">Comprehension Check</div>
            <p style="font-weight:600; font-size:0.95rem; margin:0 0 16px 0;">${seg.question}</p>
            <div id="vark-audio-opts">${optionsHtml}</div>
            ${feedbackHtml}
            ${!answered
                ? `<button id="vark-audio-check-btn" class="ns-btn-primary" onclick="varkAudioCheck('${concept.id}', ${segIdx})" disabled style="margin-top:4px;">Check Answer</button>`
                : isLast && allDone
                    ? done
                        ? `<div style="display:flex;align-items:center;gap:8px;color:#22c55e;font-weight:600;font-size:0.9rem; margin-top:4px;"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg> Session Complete — ${correctCt}/${total} correct</div>`
                        : `<div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-top:4px;">
                            <span style="font-size:0.88rem; color:var(--ns-text-muted);">Score: ${correctCt} / ${total}</span>
                            <button class="ns-btn-primary" onclick="varkAudioComplete('${concept.id}', ${correctCt}, ${total})" style="display:flex;align-items:center;gap:8px;">
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                Complete Audio Session
                            </button>
                           </div>`
                    : `<button class="ns-btn-primary" onclick="varkAudioGoSeg(${segIdx + 1})" style="margin-top:4px;">Next Segment →</button>`
            }
        </div>
    </div>`;
}

function _bindAudioEvents(concept, content) { /* no delegation needed — inline onclick */ }

function varkAudioSelectOpt(optIdx) {
    const opts = document.querySelectorAll('.vark-audio-opt');
    opts.forEach((o, i) => {
        o.style.background    = i === optIdx ? 'rgba(79,70,229,0.08)' : '';
        o.style.borderColor   = i === optIdx ? 'var(--ns-primary)' : 'var(--ns-sidebar-border)';
        o._selected           = (i === optIdx);
    });
    document.querySelectorAll('.vark-audio-opt').forEach((o, i) => { if (i === optIdx) o._selected = true; });
    // Store selection temporarily
    if (!_varkAudioAns._pending) _varkAudioAns._pending = {};
    _varkAudioAns._pending.optIdx = optIdx;
    const btn = document.getElementById('vark-audio-check-btn');
    if (btn) btn.disabled = false;
}

function varkAudioCheck(conceptId, segIdx) {
    const content = _getConceptContent(_varkConcepts()[state.varkSession.currentConceptIdx]);
    const seg     = content.audioSegments[segIdx];
    const selIdx  = _varkAudioAns._pending ? _varkAudioAns._pending.optIdx : null;
    if (selIdx === null) return;
    const correct = selIdx === seg.correct;
    _varkAudioAns[segIdx]                = correct;
    _varkAudioAns[segIdx + '_sel']       = selIdx;
    if (!_varkAudioAns._pending) _varkAudioAns._pending = {};
    _varkAudioAns._pending = {};
    // Re-render segment
    const s       = state.varkSession;
    const concept = _varkConcepts()[s.currentConceptIdx];
    const total   = content.audioSegments.length;
    document.getElementById('vark-session-content').innerHTML =
        _buildAudioSegmentHTML(concept, seg, segIdx, total, content);
}

function varkAudioGoSeg(segIdx) {
    _varkAudioSeg = segIdx;
    const s       = state.varkSession;
    const concept = _varkConcepts()[s.currentConceptIdx];
    const content = _getConceptContent(concept);
    const segs    = content.audioSegments;
    document.getElementById('vark-session-content').innerHTML =
        _buildAudioSegmentHTML(concept, segs[segIdx], segIdx, segs.length, content);
}

function varkAudioComplete(conceptId, correctCt, total) {
    // Mastery delta: +4% per correct answer
    const delta = (correctCt / total) * 0.12;
    _updateConceptMastery(state.varkSession.courseId, conceptId, delta);
    _markVARKComplete(conceptId);
    // Re-render to show complete state
    const s       = state.varkSession;
    const concept = _varkConcepts()[s.currentConceptIdx];
    const content = _getConceptContent(concept);
    const segs    = content.audioSegments;
    document.getElementById('vark-session-content').innerHTML =
        _buildAudioSegmentHTML(concept, segs[_varkAudioSeg], _varkAudioSeg, segs.length, content);
}

function varkSpeakSeg(btn) {
    if (!window.speechSynthesis) { alert('Text-to-speech not supported in this browser.'); return; }
    if (window.speechSynthesis.speaking) { window.speechSynthesis.cancel(); btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg> Listen'; return; }
    const text = btn.dataset.text.replace(/&quot;/g, '"');
    const utt  = new SpeechSynthesisUtterance(text);
    utt.rate   = 0.92; utt.pitch = 1;
    utt.onend  = () => { btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg> Listen'; };
    btn.textContent = '⏹ Stop';
    window.speechSynthesis.speak(utt);
}

/* ══════════════════════════════════════════════════════════════════════════
   READING / WRITING MODE
══════════════════════════════════════════════════════════════════════════ */

function _renderReadingConcept(concept, content, courseId) {
    const noteKey  = courseId + '_' + concept.id;
    const saved    = (state.varkNotes && state.varkNotes[noteKey]) || '';
    const prog     = (state.varkProgress && (state.varkProgress[courseId] || {}));
    const done     = (prog[concept.id] || {}).reading;

    return `
    <div class="vark-reading-layout">
        <!-- Left: lecture notes -->
        <div class="vark-reading-left">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:14px;">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" style="color:var(--ns-primary);flex-shrink:0;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                <h4 style="margin:0; font-size:0.9rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--ns-text-muted);">Lecture Notes</h4>
            </div>
            <div class="vark-lecture-content" style="font-size:0.88rem; line-height:1.75;">
                ${content.lectureNotes}
            </div>
        </div>
        <!-- Right: user notes -->
        <div class="vark-reading-right">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" style="color:#F59E0B;flex-shrink:0;"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    <h4 style="margin:0; font-size:0.9rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--ns-text-muted);">My Notes</h4>
                </div>
                ${done
                    ? `<div style="display:flex;align-items:center;gap:6px;color:#22c55e;font-size:0.82rem;font-weight:600;"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg> Saved</div>`
                    : `<button class="ns-btn-primary" onclick="varkReadingSave('${concept.id}', '${noteKey}')" style="font-size:0.8rem; padding:6px 12px;">Save Notes ✓</button>`
                }
            </div>
            <textarea class="vark-notes-textarea" id="vark-notes-${noteKey}" placeholder="Write your own notes, summaries, and key points here…&#10;&#10;Tips:&#10;• Summarize each section in your own words&#10;• Note things you want to look up&#10;• Mark concepts you find difficult"
                oninput="varkNotesInput(this, '${noteKey}')">${saved}</textarea>
            <div style="font-size:0.75rem; color:var(--ns-text-muted); margin-top:8px; display:flex; align-items:center; gap:6px;">
                <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                Writing in your own words improves retention 2× compared to re-reading
            </div>
        </div>
    </div>`;
}

function varkNotesInput(textarea, noteKey) {
    if (!state.varkNotes) state.varkNotes = {};
    state.varkNotes[noteKey] = textarea.value;
}

function varkReadingSave(conceptId, noteKey) {
    if (!state.varkNotes) state.varkNotes = {};
    const ta = document.getElementById('vark-notes-' + noteKey);
    if (ta) state.varkNotes[noteKey] = ta.value;
    _markVARKComplete(conceptId);
    // Refresh reading view to show saved state
    const s       = state.varkSession;
    const concept = _varkConcepts()[s.currentConceptIdx];
    const content = _getConceptContent(concept);
    document.getElementById('vark-session-content').innerHTML =
        _renderReadingConcept(concept, content, s.courseId);
}

function saveVARKNotes(textarea) { /* legacy compat */ }

/* ══════════════════════════════════════════════════════════════════════════
   KINESTHETIC MODE
══════════════════════════════════════════════════════════════════════════ */

function _renderKineticConcept(concept, content) {
    const acts  = content.activities || [];
    const total = acts.length;
    const act   = acts[_varkKineticAct];
    if (!act) return '<p style="color:var(--ns-text-muted);">No activities available.</p>';
    return _buildKineticActivityHTML(concept, act, _varkKineticAct, total, content);
}

function _buildKineticActivityHTML(concept, act, actIdx, total, content) {
    const answered = _varkKineticAns[actIdx] !== undefined;
    const correct  = _varkKineticAns[actIdx] === true;
    const isLast   = actIdx === total - 1;
    const allDone  = _varkKineticAns.filter(a => a !== undefined).length === total;
    const correctCt= _varkKineticAns.filter(a => a === true).length;
    const prog     = (state.varkProgress && (state.varkProgress[state.varkSession.courseId] || {}));
    const done     = (prog[concept.id] || {}).kinesthetic;

    const typeLabels = { mcq:'Multiple Choice', code_trace:'Code Trace', scenario:'Scenario', edge_case:'Edge Case', reflection:'Reflection', fill_blank:'Complete the Code', refactor:'Refactor Challenge', design:'Design Challenge', tdd:'TDD Practice', security:'Security Awareness', debt:'Technical Debt', default:'Activity' };
    const typeLabel  = typeLabels[act.type] || typeLabels.default;
    const typeColors = { mcq:'#4F46E5', code_trace:'#10B981', scenario:'#F59E0B', edge_case:'#EC4899', reflection:'#6B7280', fill_blank:'#10B981', refactor:'#F59E0B', design:'#4F46E5', tdd:'#10B981', security:'#EC4899', debt:'#F59E0B' };
    const typeColor  = typeColors[act.type] || '#4F46E5';

    const isReflection = act.correct === -1;

    const optionsHtml = act.options.map((opt, i) => {
        let bg = '', bc = 'var(--ns-sidebar-border)', tc = 'var(--ns-text-main)';
        if (answered && !isReflection) {
            if (i === act.correct)                          { bg = 'rgba(34,197,94,0.12)'; bc = '#22c55e'; }
            else if (_varkKineticAns[actIdx + '_sel'] === i) { bg = 'rgba(239,68,68,0.1)';  bc = '#ef4444'; }
        } else if (answered && isReflection) {
            if (_varkKineticAns[actIdx + '_sel'] === i) { bg = 'rgba(79,70,229,0.1)'; bc = 'var(--ns-primary)'; }
        }
        return `<div class="vark-kinetic-opt ${answered ? 'locked' : ''}" data-idx="${i}"
            style="padding:11px 16px; border-radius:10px; border:1.5px solid ${bc}; background:${bg}; color:${tc}; cursor:${answered ? 'default' : 'pointer'}; margin-bottom:8px; display:flex; align-items:center; gap:10px; transition:all 0.15s;"
            ${!answered ? `onclick="varkKineticSelectOpt(${i})"` : ''}>
            <span style="font-weight:700; color:${answered && !isReflection && i === act.correct ? '#22c55e' : 'var(--ns-primary)'}; min-width:20px;">${['A','B','C','D'][i]}.</span>
            <span style="font-size:0.9rem;">${opt}</span>
        </div>`;
    }).join('');

    const feedbackHtml = answered ? `
        <div style="padding:12px 16px; border-radius:10px; margin-top:4px; margin-bottom:16px; background:${isReflection ? 'rgba(79,70,229,0.06)' : correct ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)'}; border:1px solid ${isReflection ? 'var(--ns-primary)44' : correct ? '#22c55e44' : '#ef444444'};">
            ${isReflection ? '' : `<span style="font-weight:700; color:${correct ? '#22c55e' : '#ef4444'};">${correct ? '✓ Correct!' : '✗ Not quite.'}</span> `}
            <span style="font-size:0.88rem; color:var(--ns-text-main); ${!isReflection ? 'margin-left:4px;' : ''}">${act.explanation}</span>
        </div>` : '';

    const promptHtml = act.prompt.includes('\n')
        ? `<div class="vark-code-block" style="margin-bottom:14px;">${act.prompt.replace(/\n/g, '<br>')}</div>`
        : `<p style="font-weight:500; font-size:0.95rem; margin:0 0 16px 0; line-height:1.6;">${act.prompt}</p>`;

    return `
    <div>
        <!-- Activity step progress -->
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:20px; flex-wrap:wrap;">
            ${Array.from({length: total}, (_, i) => {
                const isDone = _varkKineticAns[i] !== undefined;
                const isAct  = i === actIdx;
                return `<div style="width:${100/total < 5 ? '40' : Math.floor(100/total)}%; min-width:36px; max-width:120px; height:36px; border-radius:10px; border:2px solid ${isAct ? 'var(--ns-primary)' : isDone ? '#22c55e' : 'var(--ns-sidebar-border)'}; background:${isAct ? 'rgba(79,70,229,0.08)' : isDone ? 'rgba(34,197,94,0.08)' : 'transparent'}; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:0.75rem; font-weight:700; color:${isAct ? 'var(--ns-primary)' : isDone ? '#22c55e' : 'var(--ns-text-muted)'}; transition:all 0.15s;" onclick="varkKineticGoAct(${i}, '${concept.id}')" title="Step ${i+1}">
                    ${isDone ? '<svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>' : i + 1}
                </div>`;
            }).join('')}
            <span style="font-size:0.8rem; color:var(--ns-text-muted); margin-left:4px;">${actIdx + 1} / ${total} steps</span>
        </div>

        <!-- Activity card -->
        <div class="ns-card" style="padding:24px; margin-bottom:16px;">
            <div style="margin-bottom:16px;">
                <span style="background:${typeColor}18; color:${typeColor}; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; padding:3px 10px; border-radius:12px;">${typeLabel}</span>
                <h4 style="margin:10px 0 14px 0; font-size:1.05rem;">${act.title}</h4>
                ${promptHtml}
            </div>
            <div id="vark-kinetic-opts">${optionsHtml}</div>
            ${feedbackHtml}
            ${!answered
                ? `<button id="vark-kinetic-check-btn" class="ns-btn-primary" onclick="varkKineticCheck('${concept.id}', ${actIdx})" disabled style="margin-top:4px;">Check Answer</button>`
                : isLast && allDone
                    ? done
                        ? `<div style="display:flex;align-items:center;gap:8px;color:#22c55e;font-weight:600;font-size:0.9rem;margin-top:4px;"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg> Session Complete — ${correctCt}/${total} correct</div>`
                        : `<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:4px;">
                            <span style="font-size:0.88rem;color:var(--ns-text-muted);">Score: ${correctCt} / ${total}</span>
                            <button class="ns-btn-primary" onclick="varkKineticComplete('${concept.id}', ${correctCt}, ${total})" style="display:flex;align-items:center;gap:8px;">
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                Complete Session
                            </button>
                           </div>`
                    : `<button class="ns-btn-primary" onclick="varkKineticGoAct(${actIdx + 1}, '${concept.id}')" style="display:flex;align-items:center;gap:6px;margin-top:4px;">Next Activity <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg></button>`
            }
        </div>
    </div>`;
}

function _bindKineticEvents(concept, content) { /* inline onclicks */ }

function varkKineticSelectOpt(optIdx) {
    document.querySelectorAll('.vark-kinetic-opt').forEach((o, i) => {
        o.style.background  = i === optIdx ? 'rgba(79,70,229,0.08)' : '';
        o.style.borderColor = i === optIdx ? 'var(--ns-primary)' : 'var(--ns-sidebar-border)';
    });
    if (!_varkKineticAns._pending) _varkKineticAns._pending = {};
    _varkKineticAns._pending.optIdx = optIdx;
    const btn = document.getElementById('vark-kinetic-check-btn');
    if (btn) btn.disabled = false;
}

function varkKineticCheck(conceptId, actIdx) {
    const concept = _varkConcepts()[state.varkSession.currentConceptIdx];
    const content = _getConceptContent(concept);
    const act     = content.activities[actIdx];
    const selIdx  = _varkKineticAns._pending ? _varkKineticAns._pending.optIdx : null;
    if (selIdx === null) return;
    const isReflection = act.correct === -1;
    const correct = isReflection ? true : selIdx === act.correct;
    _varkKineticAns[actIdx]           = correct;
    _varkKineticAns[actIdx + '_sel']  = selIdx;
    _varkKineticAns._pending          = {};
    const total = content.activities.length;
    document.getElementById('vark-session-content').innerHTML =
        _buildKineticActivityHTML(concept, act, actIdx, total, content);
}

function varkKineticGoAct(actIdx, conceptId) {
    _varkKineticAct = actIdx;
    const concept = _varkConcepts()[state.varkSession.currentConceptIdx];
    const content = _getConceptContent(concept);
    const acts    = content.activities;
    document.getElementById('vark-session-content').innerHTML =
        _buildKineticActivityHTML(concept, acts[actIdx], actIdx, acts.length, content);
}

function varkKineticComplete(conceptId, correctCt, total) {
    const delta = (correctCt / total) * 0.10;
    _updateConceptMastery(state.varkSession.courseId, conceptId, delta);
    _markVARKComplete(conceptId);
    const concept = _varkConcepts()[state.varkSession.currentConceptIdx];
    const content = _getConceptContent(concept);
    const acts    = content.activities;
    document.getElementById('vark-session-content').innerHTML =
        _buildKineticActivityHTML(concept, acts[_varkKineticAct], _varkKineticAct, acts.length, content);
}

/* ── File upload ──────────────────────────────────────────────────────────── */

function handleVARKFileUpload(input) {
    const container = document.getElementById('vark-uploaded-files');
    if (!container) return;
    Array.from(input.files).forEach(file => {
        const ext  = file.name.split('.').pop().toUpperCase();
        const size = file.size < 1024*1024 ? Math.round(file.size/1024) + ' KB' : (file.size/(1024*1024)).toFixed(1) + ' MB';
        const item = document.createElement('div');
        item.className = 'vark-uploaded-file';
        item.innerHTML = `
            <span style="background:var(--ns-primary);color:#fff;border-radius:4px;padding:2px 7px;font-size:0.72rem;font-weight:700;">${ext}</span>
            <span style="flex:1;font-size:0.85rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${file.name}</span>
            <span style="color:var(--ns-text-muted);font-size:0.78rem;flex-shrink:0;">${size}</span>
            <button onclick="this.closest('.vark-uploaded-file').remove()" style="background:none;border:none;cursor:pointer;color:var(--ns-text-muted);font-size:1.1rem;padding:0 4px;line-height:1;" title="Remove">×</button>`;
        container.appendChild(item);
    });
    input.value = '';
}
