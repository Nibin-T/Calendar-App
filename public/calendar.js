// public/calendar.js
document.addEventListener('DOMContentLoaded', () => {
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const currentMonthSpan = document.getElementById('current-month');
    const calendarGrid = document.getElementById('calendar-grid');
  
    let currentDate = moment();
    let currentYear = currentDate.year();
    let currentMonth = currentDate.month();
  
    function updateCalendar() {
      const firstDayOfMonth = moment([currentYear, currentMonth, 1]);
      const lastDayOfMonth = moment(firstDayOfMonth).endOf('month');
      const daysInMonth = lastDayOfMonth.date();
      const firstDayOfWeek = firstDayOfMonth.day();
      const monthName = moment.months(currentMonth);
  
      currentMonthSpan.textContent = `${monthName} ${currentYear}`;
      calendarGrid.innerHTML = '';
  
      fetch(`/events/month/${currentYear}/${currentMonth + 1}`)
        .then((response) => response.json())
        .then((events) => {
          let dayCounter = 1;
          for (let i = 0; i < 42; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('calendar-day');
  
            if (i >= firstDayOfWeek && dayCounter <= daysInMonth) {
              const dayNumberSpan = document.createElement('span');
              dayNumberSpan.classList.add('day-number');
              dayNumberSpan.textContent = dayCounter;
              dayDiv.appendChild(dayNumberSpan);
  
              const dayEvents = events.filter((event) => {
                return moment(event.startDate).date() === dayCounter &&
                  moment(event.startDate).month() === currentMonth &&
                  moment(event.startDate).year() === currentYear;
              });
  
              const eventsList = document.createElement('ul');
              eventsList.classList.add('events');
  
              dayEvents.forEach((event) => {
                const eventItem = document.createElement('li');
                eventItem.textContent = event.title;
  
                const editLink = document.createElement('a');
                editLink.href = `/events/edit/${event._id}`;
                editLink.textContent = 'Edit';
                eventItem.appendChild(editLink);
  
                const deleteLink = document.createElement('a');
                deleteLink.href = `/events/delete/${event._id}`;
                deleteLink.textContent = 'Delete';
                eventItem.appendChild(deleteLink);
  
                eventsList.appendChild(eventItem);
              });
  
              dayDiv.appendChild(eventsList);
              dayCounter++;
            }
            calendarGrid.appendChild(dayDiv);
          }
        });
    }
  
    updateCalendar();
  
    prevMonthButton.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      updateCalendar();
    });
  
    nextMonthButton.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      updateCalendar();
    });
  });