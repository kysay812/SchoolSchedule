import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Settings2, FastForward } from 'lucide-react';

const classes = [
  '5а', '5б', '6а', '6б', '7а', '7б', '8а', '8б', '9а', '9б', 
  '10а (техн)', '10б (гум)', '11а (сэ)', '11б (гум)'
];

const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];
const dayShorts = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ'];

type Lesson = {
  lesson: number;
  start: string;
  end: string;
  subjects: string[];
};

const baseLessons: Lesson[] = [
  { lesson: 1, start: '08:00', end: '08:40', subjects: ['Сон на парте', 'Битва за сменку', 'ОБЖ (сонный час)', 'Матика (плач)', 'Русский (храп)', 'История мемов', 'ВД Биология', 'ВД Информ.', 'Россия-мои гор.', 'Обществ. / Физика', 'Обществ. / Физика', 'Литра', 'Химия', 'Физра'] },
  { lesson: 2, start: '08:50', end: '09:30', subjects: ['Математика', 'География', 'Технология (печеньки)', 'Музыка', 'ИЗО', 'Алгебра', 'Геометрия', 'Биология', 'Англ. язык', 'Обществ. / Физика', 'Обществ. / Физика', 'Информатика', 'Физика', 'История'] },
  { lesson: 3, start: '09:50', end: '10:30', subjects: ['Битва в столовой', 'Поиск сосиски в тесте', 'Забег за чаем', 'Очередь за пиццей', 'Английский', 'Химия', 'История', 'Химия', 'Англ. язык', 'Физика / Обществ.', 'Физика / Обществ.', 'Литература', 'Геометрия', 'Биология'] },
  { lesson: 4, start: '10:40', end: '11:20', subjects: ['Литература', 'Русский язык', 'Математика', 'Биология', 'География', 'Физика', 'Информатика', 'Геометрия', 'Биология', 'Физика / Обществ.', 'Физика / Обществ.', 'Экономика', 'Право', 'Английский'] },
  { lesson: 5, start: '11:35', end: '12:15', subjects: ['Физра (забытая форма)', 'Музыка (хор)', 'История', 'Технология', 'Информатика', 'Геометрия', 'Русский язык', 'Вер-ть и стат-ка', 'Химия', 'Литература', 'История', 'Астрономия', 'Мат. анализ', 'Обществознание'] },
  { lesson: 6, start: '12:20', end: '13:00', subjects: ['Рисование на полях', 'Списывание ГДЗ', 'Попытка уйти домой', 'Биология', 'Литература', 'Физ-ра', 'Биология', 'Англ. язык', 'История', 'Геометрия', 'История', 'Родной язык', 'Проекты', 'Философия жизни'] },
  { lesson: 7, start: '13:05', end: '13:45', subjects: ['Доп. английский', 'Шахматы', 'Робототехника', 'Кружок мемов', 'Тихий час', 'Экология', 'Физ. культура', 'Англ. язык', 'История', 'Геометрия', 'Литература', 'МХК', 'Психология', 'Подготовка к ЕГЭ'] },
  { lesson: 8, start: '14:00', end: '14:40', subjects: ['Квиддич', 'ВД Физра', 'Киберспорт', 'ВД мат.повыш', 'МХК', 'Россия - мои гор.', 'ЕГЭ выживание', 'Разговоры о важном (2.0)', 'Сверхсложная матика', 'Высшая химия', 'Сон 2.0', '', '', ''] }
];

// Расписание с небольшими вариациями по дням
const weeklySchedule: Record<number, Lesson[]> = {
  0: baseLessons, // Понедельник
  1: baseLessons.map(l => ({ ...l, subjects: l.subjects.map((s, i) => i % 3 === 0 ? s + ' (вт)' : s) })), // Вторник
  2: baseLessons.map(l => ({ ...l, subjects: l.subjects.map((s, i) => i % 2 === 0 ? s + ' (ср)' : s) })), // Среда
  3: baseLessons, // Четверг
  4: baseLessons.map(l => ({ ...l, subjects: l.subjects.map((s, i) => i % 3 === 1 ? s + ' (пт)' : s) })) // Пятница
};

function parseTime(timeStr: string, baseDate: Date): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export default function App() {
  const [realNow, setRealNow] = useState(new Date());
  const [demoOffset, setDemoOffset] = useState(0); // in minutes
  const [showDemoControls, setShowDemoControls] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setRealNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const now = new Date(realNow.getTime() + demoOffset * 60000);

  // Get current day (0-4 for Mon-Fri)
  const dayOfWeek = now.getDay();
  const currentDayIndex = dayOfWeek === 0 ? 4 : dayOfWeek - 1; // Convert to 0=Mon, 4=Fri
  const currentLessons = weeklySchedule[currentDayIndex] || baseLessons;
  
  const currentLessonIndex = currentLessons.findIndex(l => {
    const start = parseTime(l.start, now);
    const end = parseTime(l.end, now);
    return now >= start && now < end;
  });

  const currentLesson = currentLessonIndex !== -1 ? currentLessons[currentLessonIndex] : null;
  const firstStart = parseTime(currentLessons[0].start, now);
  const lastEnd = parseTime(currentLessons[currentLessons.length - 1].end, now);

  let statusText = '';
  let countdown = '';
  let statusColor = 'text-slate-400';

  if (now < firstStart) {
    statusText = 'Уроки еще не начались';
    const diff = Math.floor((firstStart.getTime() - now.getTime()) / 1000);
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    countdown = `До начала 1 урока: ${m} мин ${s.toString().padStart(2, '0')} сек`;
  } else if (now >= lastEnd) {
    statusText = 'Уроки закончились';
  } else if (currentLesson) {
    const end = parseTime(currentLesson.end, now);
    const diff = Math.floor((end.getTime() - now.getTime()) / 1000);
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    
    statusText = `Идет ${currentLesson.lesson} урок`;
    statusColor = 'text-emerald-400';
    countdown = `До конца: ${m} мин ${s.toString().padStart(2, '0')} сек`;
  }

  return (
    <div className="h-screen bg-slate-950 text-slate-100 font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 shadow-lg flex justify-between items-center z-10 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Школьное Расписание 2026</h1>
          <div className="flex items-center text-slate-400 text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="capitalize">{formatDate(now)}</span>
          </div>
        </div>
        
        <div className="text-right flex flex-col items-end">
          <div className="flex items-center text-3xl font-mono font-bold text-white mb-1">
            <Clock className="w-6 h-6 mr-2 text-blue-400" />
            {formatTime(now)}
          </div>
          <div className="flex flex-col items-end">
            <div className={`text-lg font-bold ${statusColor}`}>{statusText}</div>
            {countdown && <div className="text-sm text-slate-300 font-mono mt-0.5">{countdown}</div>}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="w-full h-full bg-slate-900 shadow-2xl overflow-hidden flex flex-col">
          <table className="flex-1 text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-800 text-slate-300 text-xs uppercase tracking-wider sticky top-0">
                <th className="p-1 font-semibold text-center border-b border-slate-700 w-16">День</th>
                <th className="p-1 font-semibold text-center border-b border-slate-700 w-10">Урок</th>
                <th className="p-1 font-semibold text-center border-b border-slate-700 w-20">Время</th>
                {classes.map(c => (
                  <th key={c} className="p-1 font-semibold border-b border-slate-700 border-l border-slate-700/50 text-center">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {daysOfWeek.map((day, dayIdx) => {
                const dayLessons = weeklySchedule[dayIdx] || baseLessons;
                const isCurrentDay = currentDayIndex === dayIdx;
                
                return dayLessons.map((lesson, lessonIdx) => {
                  const isCurrent = isCurrentDay && currentLessonIndex === lessonIdx;
                  const start = parseTime(lesson.start, now);
                  const end = parseTime(lesson.end, now);
                  const isPast = end <= now && isCurrentDay;
                  
                  return (
                    <tr 
                      key={`${dayIdx}-${lessonIdx}`}
                      className={`
                        transition-all duration-500 text-sm border-b border-slate-800
                        ${isCurrent ? 'bg-emerald-900/40 border-l-4 border-l-emerald-500 shadow-[inset_0_0_30px_rgba(16,185,129,0.15)]' : ''}
                        ${isPast ? 'opacity-40' : ''}
                        ${isCurrentDay && !isCurrent ? 'bg-slate-900/50' : 'bg-slate-900/30'}
                      `}
                    >
                      <td className={`p-1 text-center font-bold border-r border-slate-700/50 text-xs ${isCurrentDay && lessonIdx === 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {lessonIdx === 0 && (
                          <div>
                            <div className="font-bold">{dayShorts[dayIdx]}</div>
                            <div className="text-xs text-slate-500">{day.slice(0, 3)}</div>
                          </div>
                        )}
                      </td>
                      <td className={`p-1 text-center font-bold text-sm border-r border-slate-700/50 ${isCurrent ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {lesson.lesson}
                      </td>
                      <td className={`p-1 text-center font-mono whitespace-nowrap border-r border-slate-700/50 text-xs ${isCurrent ? 'text-emerald-300 font-bold' : 'text-slate-400'}`}>
                        {lesson.start} - {lesson.end}
                      </td>
                      {lesson.subjects.map((subject, i) => (
                        <td key={i} className={`p-1 border-l border-slate-700/50 text-xs ${isCurrent ? 'text-white font-medium' : ''}`}>
                          {subject || <span className="text-slate-700">-</span>}
                        </td>
                      ))}
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
        </div>
      </main>

      {/* Demo Controls */}
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => setShowDemoControls(!showDemoControls)}
          className="bg-slate-800 p-3 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 shadow-lg transition-colors"
          title="Настройки времени (Демо)"
        >
          <Settings2 className="w-6 h-6" />
        </button>
        
        {showDemoControls && (
          <div className="absolute bottom-16 right-0 bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-2xl w-80">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <FastForward className="w-5 h-5 mr-2 text-blue-400" />
              Демо-режим времени
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Сдвиньте время, чтобы увидеть, как расписание меняется в течение дня.
            </p>
            
            <div className="mb-2 flex justify-between text-sm font-mono text-blue-300">
              <span>{formatTime(now)}</span>
              <span>{demoOffset > 0 ? `+${demoOffset}м` : demoOffset < 0 ? `${demoOffset}м` : 'Реальное время'}</span>
            </div>
            
            <input 
              type="range" 
              min="-480" 
              max="480" 
              value={demoOffset} 
              onChange={(e) => setDemoOffset(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
            
            <div className="flex justify-between mt-4">
              <button 
                onClick={() => setDemoOffset(0)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm font-medium transition-colors"
              >
                Сбросить
              </button>
              <button 
                onClick={() => {
                  const target = new Date(realNow);
                  target.setHours(10, 45, 0, 0);
                  setDemoOffset(Math.floor((target.getTime() - realNow.getTime()) / 60000));
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium transition-colors"
              >
                Урок 4
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
