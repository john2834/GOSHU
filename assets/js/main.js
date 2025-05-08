let tripData = null;
let currentDayIndex = 0;

// 主題設置
const themes = ['theme-original', 'theme-fresh', 'theme-nature', 'theme-vibrant'];

function setTheme(themeName) {
    document.body.className = themeName;
    localStorage.setItem('selectedTheme', themeName);
}

function setRandomTheme() {
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    setTheme(randomTheme);
}

// 主題選擇器
function initializeThemeSwitcher() {
    const themeSwitcher = document.getElementById('theme-switcher');
    const themeToggle = document.getElementById('theme-toggle');
    const themeOptions = document.querySelectorAll('.theme-option');

    // 切換主題選擇器的展開/收合
    themeToggle.addEventListener('click', () => {
        themeSwitcher.classList.toggle('collapsed');
    });

    // 選擇主題
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const themeName = option.getAttribute('data-theme');
            setTheme(themeName);
            themeSwitcher.classList.add('collapsed');
        });
    });

    // 載入儲存的主題
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setRandomTheme();
    }
}

// 載入行程資料
async function loadTripData() {
    setRandomTheme();
    try {
        const response = await fetch('ztmy_trip.json');
        tripData = await response.json();
        initializeNavigation();
        displayDay(currentDayIndex);
    } catch (error) {
        console.error('Error loading trip data:', error);
        document.querySelector('.loading').textContent = '載入失敗，請重新整理頁面';
    }
}

// 初始化日期導航
function initializeNavigation() {
    const dateNav = document.getElementById('date-nav');
    tripData.forEach((day, index) => {
        const button = document.createElement('button');
        button.className = 'date-button';
        button.textContent = `Day ${index + 1}`;
        button.addEventListener('click', () => {
            currentDayIndex = index;
            displayDay(index);
            updateActiveButton();
        });
        dateNav.appendChild(button);
    });
    updateActiveButton();
}

// 更新活躍按鈕狀態
function updateActiveButton() {
    const buttons = document.querySelectorAll('.date-button');
    buttons.forEach((button, index) => {
        button.classList.toggle('active', index === currentDayIndex);
    });
}

// 顯示指定日期的行程
// 處理描述中的 Mapcode
function processDescription(desc) {
    const mapcodeMatch = desc.match(/\[Mapcode: ([^\]]+)\]/);
    if (mapcodeMatch) {
        return {
            desc: desc.replace(mapcodeMatch[0], '').trim(),
            mapcode: mapcodeMatch[1]
        };
    }
    return { desc };
}

// 回到頂部按鈕
function createBackToTopButton() {
    const button = document.createElement('button');
    button.id = 'back-to-top';
    button.innerHTML = '⬆ TOP';
    button.style.display = 'none';
    document.body.appendChild(button);

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 150) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });
}

function displayDay(index) {
    const day = tripData[index];
    const content = document.getElementById('trip-content');
    let currentMainEvent = null;
    let subEvents = [];
    
    const processedEvents = day.events.reduce((acc, event) => {
        if (event.desc.match(/^[a-z]\./i)) {
            // 這是一個子選項
            if (currentMainEvent) {
                if (!currentMainEvent.subEvents) {
                    currentMainEvent.subEvents = [];
                }
                currentMainEvent.subEvents.push(event);
            }
        } else {
            // 這是一個主選項
            if (currentMainEvent) {
                acc.push(currentMainEvent);
            }
            currentMainEvent = event;
        }
        return acc;
    }, []);
    
    // 加入最後一個主選項
    if (currentMainEvent) {
        processedEvents.push(currentMainEvent);
    }
    
    content.innerHTML = `
        <h2 class="day-title">${day.title}</h2>
        <div class="events">
            ${processedEvents.map(event => `
                <div class="event${event.subEvents ? ' has-subitems collapsed' : ''}" 
                     ${event.subEvents ? 'onclick="toggleSubEvents(this)"' : ''}>
                    ${event.time ? `<span class="event-time">⏰ ${event.time}</span>` : ''}
                    <div class="event-desc">${processDescription(event.desc).desc}</div>
                    ${processDescription(event.desc).mapcode ? `<div class="mapcode">🎯 Mapcode: ${processDescription(event.desc).mapcode}</div>` : ''}
                    ${event.map ? `
                        <a href="${event.map}" target="_blank" class="map-link" onclick="event.stopPropagation()">
                            📍 在地圖中查看
                        </a>
                    ` : ''}
                    ${event.subEvents ? `
                        <div class="sub-events">
                            ${event.subEvents.map(subEvent => `
                                <div class="event">
                                    ${subEvent.time ? `<span class="event-time">⏰ ${subEvent.time}</span>` : ''}
                                    <div class="event-desc">${processDescription(subEvent.desc).desc}</div>
                                    ${processDescription(subEvent.desc).mapcode ? `<div class="mapcode">🎯 Mapcode: ${processDescription(subEvent.desc).mapcode}</div>` : ''}
                                    ${subEvent.map ? `
                                        <a href="${subEvent.map}" target="_blank" class="map-link">
                                            📍 在地圖中查看
                                        </a>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

// 設置前後日期切換
document.getElementById('prev-day').addEventListener('click', () => {
    if (currentDayIndex > 0) {
        currentDayIndex--;
        displayDay(currentDayIndex);
        updateActiveButton();
        updateNavigationButtons();
    }
});

document.getElementById('next-day').addEventListener('click', () => {
    if (currentDayIndex < tripData.length - 1) {
        currentDayIndex++;
        displayDay(currentDayIndex);
        updateActiveButton();
        updateNavigationButtons();
    }
});

// 切換子選項的顯示/隱藏
function toggleSubEvents(element) {
    const subEvents = element.querySelector('.sub-events');
    if (subEvents) {
        element.classList.toggle('collapsed');
        subEvents.classList.toggle('visible');
    }
}

// 手勢操作支援
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchEndX - touchStartX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && currentDayIndex > 0) {
            // 向右滑動，顯示前一天
            currentDayIndex--;
            displayDay(currentDayIndex);
            updateActiveButton();
        } else if (diff < 0 && currentDayIndex < tripData.length - 1) {
            // 向左滑動，顯示下一天
            currentDayIndex++;
            displayDay(currentDayIndex);
            updateActiveButton();
        }
    }
}

// 更新導航按鈕顯示狀態
function updateNavigationButtons() {
    const prevButton = document.getElementById('prev-day');
    const nextButton = document.getElementById('next-day');
    
    prevButton.style.display = currentDayIndex === 0 ? 'none' : 'block';
    nextButton.style.display = currentDayIndex === tripData.length - 1 ? 'none' : 'block';
}

// 創建回到頂部按鈕
createBackToTopButton();

// 載入行程資料
loadTripData();
initializeThemeSwitcher();
