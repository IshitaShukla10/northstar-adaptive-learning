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

        // 2. Quick Insights (dashboard sidebar)
        const recs = data.weekly_report.prescriptive_analysis.recommendations.slice(0, 3);
        const insightsList = document.getElementById('ns-insights-list');
        if (insightsList && recs.length > 0) {
            insightsList.innerHTML = recs.map(r =>
                `<li><strong>${r.concept_name}:</strong> ${r.rationale}</li>`
            ).join('');
        }

        // 3. Populate courseAnalyticsData['1'] with real backend concepts
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
 * Sends a message to the AI Study Coach.
 * Shows a typing indicator, calls the backend, renders the reply.
 */
async function sendCoachMessage() {
    const input = document.getElementById('ns-coach-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    _appendCoachMessage('user', text);
    _coachHistory.push({ role: 'user', content: text });

    // Show typing indicator
    const typingId = 'coach-typing-' + Date.now();
    _appendCoachMessage('assistant', '…', typingId);

    try {
        const res = await fetch('http://localhost:8000/chat/study-coach', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                student_id: 'stu_001',
                subject: 'computer_security',
                message: text,
                history: _coachHistory.slice(-8),
            }),
        });

        // Remove typing indicator
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();

        if (res.ok) {
            const data = await res.json();
            const reply = data.reply || 'Sorry, I couldn\'t generate a response.';
            _appendCoachMessage('assistant', reply);
            _coachHistory.push({ role: 'assistant', content: reply });
        } else {
            _appendCoachMessage('assistant', _generateLocalCoachReply(text));
        }
    } catch (_) {
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();
        _appendCoachMessage('assistant', _generateLocalCoachReply(text));
    }
}

function _appendCoachMessage(role, text, id) {
    const container = document.getElementById('ns-coach-messages');
    if (!container) return;
    const div = document.createElement('div');
    div.className = `ns-coach-msg ns-coach-msg-${role}`;
    if (id) div.id = id;
    const label = role === 'user' ? 'You' : 'AI Coach';
    div.innerHTML = `<strong>${label}</strong><p>${text.replace(/\n/g, '<br>')}</p>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

/** Fallback local reply when backend is unavailable */
function _generateLocalCoachReply(question) {
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

        // ── 2. Update the Precision Practice widget ─────────────────────────
        const ppWidget = document.getElementById('widget-practice');
        if (ppWidget && allWeak.length > 0) {
            const totalMins = allWeak.slice(0, 6).reduce((sum, c) => sum + c.study_time_minutes, 0);
            const itemsHtml = allWeak.slice(0, 6).map(c => `
                <div style="display:flex; justify-content:space-between; align-items:center;
                            padding: 6px 0; border-bottom: 1px solid var(--ns-sidebar-border);">
                    <div>
                        <div style="font-weight:600; font-size:0.85rem;">${c.name}</div>
                        <div style="font-size:0.75rem; color:var(--ns-text-muted);">${c.subject_display} · ${c.difficulty}</div>
                    </div>
                    <div style="text-align:right; flex-shrink:0;">
                        <div style="color:var(--ns-danger); font-weight:700; font-size:0.85rem;">${c.mastery_pct}%</div>
                        <div style="font-size:0.75rem; color:var(--ns-text-muted);">~${c.study_time_minutes}m</div>
                    </div>
                </div>
            `).join('');

            ppWidget.innerHTML = `
                <button class="ns-widget-remove" data-id="widget-practice" title="Remove widget">&times;</button>
                <h3 style="margin:0 0 4px 0;">Precision Practice</h3>
                <p style="margin:0 0 12px 0; font-size:0.85rem; color:var(--ns-text-muted);">
                    ${allWeak.length} weak concept${allWeak.length !== 1 ? 's' : ''} across all subjects · ~${totalMins}m total
                </p>
                <div style="margin-bottom:4px;">${itemsHtml}</div>
            `;

            // Re-bind remove button
            ppWidget.querySelector('.ns-widget-remove')?.addEventListener('click', () => {
                ppWidget.closest('.ns-widget') && ppWidget.remove();
            });
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
        // Coach view is static HTML; just ensure it's shown
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
        <div class="ns-card ns-course-card" data-course-id="${c.id}" style="cursor:pointer;" onclick="openCourseAnalytics('${c.id}')">
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
    '1': { // SC3010 — populated from backend; PDF: Lecture 4.pdf + Tutorial 3.pdf
        name: 'Computer Security',
        code: 'SC3010',
        pdfSource: 'Lecture 4.pdf',
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

    // 6. Quick Insights
    renderQuickInsights(annotated);

    // 7. Exam Readiness card in sidebar
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
