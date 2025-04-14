document.addEventListener('DOMContentLoaded', () => {
    // Existing selectors
    const monthYearElement = document.getElementById('month-year'); // In calendar header
    const calendarMonthYearTitle = document.getElementById('calendar-month-year-title'); // In top bar
    const datesElement = document.getElementById('calendar-dates');
    const todayBtn = document.getElementById('today-btn');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const weekRangeElement = document.getElementById('week-range');
    const timeColumnElement = document.getElementById('time-column');
    const daysColumnsElement = document.getElementById('days-columns');
    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');

    // New selectors
    const toggleMenuBtn = document.getElementById('toggle-menu-btn');
    const calendarSection = document.getElementById('calendar-section');
    const mainContent = document.querySelector('.main-content'); // To potentially adjust layout

    let currentDate = new Date();
    let selectedDate = new Date();
    let isMenuHidden = false; // Track menu state

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // --- Calendar Logic ---
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const monthYearString = `${months[month]} ${year}`;

        // Update both month/year displays
        monthYearElement.textContent = monthYearString;
        calendarMonthYearTitle.textContent = monthYearString;


        datesElement.innerHTML = '';

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        // Add days from previous month
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            const dayElement = document.createElement('div');
            dayElement.textContent = daysInPrevMonth - i;
            dayElement.classList.add('other-month-day');
            datesElement.appendChild(dayElement);
        }

        // Add days of the current month
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = i;
            dayElement.classList.add('day');
            const dateObj = new Date(year, month, i);
            dayElement.dataset.date = dateObj.toISOString().split('T')[0];

            if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
                dayElement.classList.add('today');
            }
            if (year === selectedDate.getFullYear() && month === selectedDate.getMonth() && i === selectedDate.getDate()) {
                dayElement.classList.add('selected-day');
            }

            dayElement.addEventListener('click', (e) => {
                selectedDate = new Date(e.target.dataset.date + 'T00:00:00');
                currentDate = new Date(selectedDate);
                renderCalendar();
                renderWeeklySchedule();
            });
            datesElement.appendChild(dayElement);
        }

        // Add days from next month
        const totalCells = firstDayOfMonth + daysInMonth;
        const remainingCells = totalCells <= 35 ? 35 - totalCells : 42 - totalCells; // Fill up to 5 or 6 rows
        for (let i = 1; i <= remainingCells; i++) {
             const dayElement = document.createElement('div');
             dayElement.textContent = i;
             dayElement.classList.add('other-month-day');
             datesElement.appendChild(dayElement);
        }
    }

    // --- Weekly Schedule Logic (Mostly Unchanged) ---
    function getStartOfWeek(date) {
        const d = new Date(date); // Clone date
        const day = d.getDay(); // 0=Sun
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday as start
        return new Date(d.setDate(diff));
    }

     function renderWeeklySchedule() {
        timeColumnElement.innerHTML = '';
        daysColumnsElement.innerHTML = '';

        const startOfWeek = getStartOfWeek(new Date(selectedDate));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        // Display Week Range (Format: Apr 7 - Apr 13, 2025) - More specific
        const formatOptions = { month: 'short', day: 'numeric' };
        const yearFormatOption = { year: 'numeric'};
        const startStr = startOfWeek.toLocaleDateString('en-US', formatOptions);
        const endStr = endOfWeek.toLocaleDateString('en-US', formatOptions);
        const yearStr = startOfWeek.getFullYear() === endOfWeek.getFullYear() ? startOfWeek.toLocaleDateString('en-US', yearFormatOption) : `${startOfWeek.toLocaleDateString('en-US', yearFormatOption)} - ${endOfWeek.toLocaleDateString('en-US', yearFormatOption)}`;

        weekRangeElement.textContent = `${startStr} - ${endStr}, ${yearStr}`;

        // Render Time Column Labels (8 AM - 5 PM)
        for (let hour = 8; hour <= 17; hour++) {
            const timeLabel = document.createElement('div');
            const displayHour = hour === 12 ? 12 : hour % 12; // Handle 12 PM correctly
            const ampm = hour >= 12 ? 'PM' : 'AM';
            timeLabel.textContent = `${displayHour} ${ampm}`;
            timeColumnElement.appendChild(timeLabel);
        }

        // Render Day Columns
        for (let i = 0; i < 7; i++) {
            const currentDayDate = new Date(startOfWeek);
            currentDayDate.setDate(startOfWeek.getDate() + i);
            const dayColumn = document.createElement('div');
            dayColumn.classList.add('day-column');

            const dayHeader = document.createElement('div');
            dayHeader.classList.add('day-header');
            dayHeader.textContent = `${weekdays[currentDayDate.getDay()]} ${currentDayDate.getDate()}`;
            dayColumn.appendChild(dayHeader);

            const timeSlotsContainer = document.createElement('div');
            timeSlotsContainer.classList.add('time-slots');

             for (let hour = 8; hour <= 17; hour++) {
                const slot = document.createElement('div');
                slot.classList.add('slot');
                slot.dataset.date = currentDayDate.toISOString().split('T')[0];
                slot.dataset.time = `${String(hour).padStart(2, '0')}:00`;
                slot.addEventListener('click', () => {
                    console.log(`Slot clicked: ${slot.dataset.date} ${slot.dataset.time}`);
                });
                timeSlotsContainer.appendChild(slot);
            }
            dayColumn.appendChild(timeSlotsContainer);
            daysColumnsElement.appendChild(dayColumn);
        }
    }

    // --- Event Listeners ---

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    todayBtn.addEventListener('click', () => {
        currentDate = new Date();
        selectedDate = new Date();
        renderCalendar();
        renderWeeklySchedule();
    });

     prevWeekBtn.addEventListener('click', () => {
         selectedDate.setDate(selectedDate.getDate() - 7);
         currentDate = new Date(selectedDate);
         renderCalendar();
         renderWeeklySchedule();
    });

     nextWeekBtn.addEventListener('click', () => {
         selectedDate.setDate(selectedDate.getDate() + 7);
         currentDate = new Date(selectedDate);
         renderCalendar();
         renderWeeklySchedule();
    });

    // **New Listener for Hide/Show Menu**
    toggleMenuBtn.addEventListener('click', () => {
        isMenuHidden = !isMenuHidden;
        if (window.innerWidth <= 768) { // Use display none/block on small screens
             calendarSection.classList.toggle('truly-hidden', isMenuHidden);
        } else { // Use width/opacity transition on larger screens
             calendarSection.classList.toggle('hidden', isMenuHidden);
        }

        toggleMenuBtn.textContent = isMenuHidden ? 'Show Menu' : 'Hide Menu';
    });

    // Placeholder listeners for new buttons
    document.getElementById('more-actions-btn').addEventListener('click', () => {
        console.log("More Actions clicked");
        alert("More Actions clicked (placeholder)");
    });
     document.getElementById('add-sessions-btn').addEventListener('click', () => {
        console.log("Add Sessions clicked");
        alert("Add Sessions clicked (placeholder)");
    });


    // --- Initial Render ---
    renderCalendar();
    renderWeeklySchedule();

});