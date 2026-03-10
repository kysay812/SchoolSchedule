import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Settings2, FastForward } from 'lucide-react';

const classes = [
  '5а', '5б', '6а', '6б', '7а', '7б', '8а', '8б', '9а', '9б', 
  '10а (техн)', '10б (гум)', '11а (сэ)', '11б (гум)'
];

const scheduleData = [
  { 
    lesson: 1, start: '08:00', end: '08:40', 
    subjects: [
      'Сон на парте', 'Битва за сменку', 'ОБЖ (сонный час)', 'Матика (плач)', 
      'Русский (храп)', 'История мемов', 'ВД Биология', 'ВД Информ.', 
      'Россия-мои гор.', 'Обществ. / Физика', 'Обществ. / Физика', 'Литра', 'Химия', 'Физра'
    ] 
  },
  { 
    lesson: 2, start: '08:50', end: '09:30', 
    subjects: [
      'Математика', 'География', 'Технология (печеньки)', 'Музыка', 
      'ИЗО', 'Алгебра', 'Геометрия', 'Биология', 
      'Англ. язык', 'Обществ. / Физика', 'Обществ. / Физика', 'Информатика', 'Физика', 'История'
    ] 
  },
  { 
    lesson: 3, start: '09:50', end: '10:30', 
    subjects: [
      'Битва в столовой', 'Поиск сосиски в тесте', 'Забег за чаем', 'Очередь за пиццей', 
      'Английский', 'Химия', 'История', 'Химия', 
      'Англ. язык', 'Физика / Обществ.', 'Физика / Обществ.', 'Литература', 'Геометрия', 'Биология'
    ] 
  },
  { 
    lesson: 4, start: '10:40', end: '11:20', 
    subjects: [
      'Литература', 'Русский язык', 'Математика', 'Биология', 
      'География', 'Физика', 'Информатика', 'Геометрия', 
      'Биология', 'Физика / Обществ.', 'Физика / Обществ.', 'Экономика', 'Право', 'Английский'
    ] 
  },
  { 
    lesson: 5, start: '11:35', end: '12:15', 
    subjects: [
      'Физра (забытая форма)', 'Музыка (хор)', 'История', 'Технология', 
      'Информатика', 'Геометрия', 'Русский язык', 'Вер-ть и стат-ка', 
      'Химия', 'Литература', 'История', 'Астрономия', 'Мат. анализ', 'Обществознание'
    ] 
  },
  { 
    lesson: 6, start: '12:20', end: '13:00', 
    subjects: [
      'Рисование на полях', 'Списывание ГДЗ', 'Попытка уйти домой', 'Биология', 
      'Литература', 'Физ-ра', 'Биология', 'Англ. язык', 
      'История', 'Геометрия', 'История', 'Родной язык', 'Проекты', 'Философия жизни'
    ] 
  },
  { 
    lesson: 7, start: '13:05', end: '13:45', 
    subjects: [
      'Доп. английский', 'Шахматы', 'Робототехника', 'Кружок мемов', 
      'Тихий час', 'Экология', 'Физ. культура', 'Англ. язык', 
      'История', 'Геометрия', 'Литература', 'МХК', 'Психология', 'Подготовка к ЕГЭ'
    ] 
  },
  { 
    lesson: 8, start: '14:00', end: '14:40', 
    subjects: [
      'Квиддич', 'ВД Физра', 'Киберспорт', 'ВД мат.повыш', 
      'МХК', 'Россия - мои гор.', 'ЕГЭ выживание', 'Разговоры о важном (2.0)', 
      'Сверхсложная матика', 'Высшая химия', 'Сон 2.0', '', '', ''
    ] 
  }
];

type Period = {
  id: string;
  type: 'lesson' | 'break';
  name: string;
  start: string;
  end: string;
  data?: typeof scheduleData[0];
};

const periods: Period[] = [];
for (let i = 0; i < scheduleData.length; i++) {
  const lesson = scheduleData[i];
  periods.push({
    id: `l${lesson.lesson}`,
    type: 'lesson',
    name: `${lesson.lesson} урок`,
    start: lesson.start,
    end: lesson.end,
    data: lesson
  });
  
  if (i < scheduleData.length - 1) {
    const nextLesson = scheduleData[i + 1];
    periods.push({
      id: `b${lesson.lesson}`,
      type: 'break',
      name: 'Перемена',
      start: lesson.end,
      end: nextLesson.start
    });
  }
}

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

  const currentPeriodIndex = periods.findIndex(p => {
    const start = parseTime(p.start, now);
    const end = parseTime(p.end, now);
    return now >= start && now < end;
  });

  const currentPeriod = currentPeriodIndex !== -1 ? periods[currentPeriodIndex] : null;

  const firstStart = parseTime(periods[0].start, now);
  const lastEnd = parseTime(periods[periods.length - 1].end, now);

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
  } else if (currentPeriod) {
    const end = parseTime(currentPeriod.end, now);
    const diff = Math.floor((end.getTime() - now.getTime()) / 1000);
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    
    if (currentPeriod.type === 'lesson') {
      statusText = `Идет ${currentPeriod.name}`;
      statusColor = 'text-emerald-400';
    } else {
      statusText = 'Идет перемена';
      statusColor = 'text-amber-400';
    }
    countdown = `До конца: ${m} мин ${s.toString().padStart(2, '0')} сек`;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-6 shadow-lg flex justify-between items-center z-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Школьное Расписание 2026</h1>
          <div className="flex items-center text-slate-400 text-xl">
            <Calendar className="w-6 h-6 mr-2" />
            <span className="capitalize">{formatDate(now)}</span>
          </div>
        </div>
        
        <div className="text-right flex flex-col items-end">
          <div className="flex items-center text-5xl font-mono font-bold text-white mb-2">
            <Clock className="w-10 h-10 mr-4 text-blue-400" />
            {formatTime(now)}
          </div>
          <div className="flex flex-col items-end">
            <div className={`text-2xl font-bold ${statusColor}`}>{statusText}</div>
            {countdown && <div className="text-xl text-slate-300 font-mono mt-1">{countdown}</div>}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="w-full h-full bg-slate-900 border-b border-slate-800 shadow-2xl overflow-hidden">
          <table className="w-full h-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800 text-slate-300 text-xl uppercase tracking-wider">
                <th className="p-4 font-semibold w-24 text-center border-b border-slate-700">Урок</th>
                <th className="p-4 font-semibold w-40 text-center border-b border-slate-700">Время</th>
                {classes.map(c => (
                  <th key={c} className="p-4 font-semibold border-b border-slate-700 border-l border-slate-700/50">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => {
                const isPast = parseTime(period.end, now) <= now;
                const isCurrent = currentPeriod?.id === period.id;
                const isFuture = parseTime(period.start, now) > now;

                if (period.type === 'break') {
                  return (
                    <tr 
                      key={period.id} 
                      className={`
                        transition-colors duration-500
                        ${isCurrent ? 'bg-amber-900/40 border-y-2 border-amber-500 shadow-[inset_0_0_20px_rgba(245,158,11,0.2)]' : 'bg-slate-900/50'}
                        ${isPast ? 'opacity-40' : ''}
                      `}
                    >
                      <td colSpan={2} className="p-2 text-center text-slate-400 font-medium border-b border-slate-800">
                        {isCurrent ? (
                          <span className="text-amber-400 font-bold flex items-center justify-center">
                            <Clock className="w-4 h-4 mr-2" /> Перемена {period.start} - {period.end}
                          </span>
                        ) : (
                          <span className="text-sm">Перемена {period.start} - {period.end}</span>
                        )}
                      </td>
                      <td colSpan={classes.length} className="p-2 border-b border-slate-800 border-l border-slate-800/50">
                        {isCurrent && (
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-amber-500 h-1.5 transition-all duration-1000 ease-linear" 
                              style={{ 
                                width: `${Math.max(0, Math.min(100, ((now.getTime() - parseTime(period.start, now).getTime()) / (parseTime(period.end, now).getTime() - parseTime(period.start, now).getTime())) * 100))}%` 
                              }}
                            ></div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr 
                    key={period.id}
                    className={`
                      transition-all duration-500 text-xl
                      ${isCurrent ? 'bg-slate-800 border-y-2 border-emerald-500 shadow-[inset_0_0_30px_rgba(16,185,129,0.15)]' : 'border-b border-slate-800'}
                      ${isPast ? 'opacity-30 grayscale' : ''}
                      ${isFuture ? 'text-slate-300' : ''}
                    `}
                  >
                    <td className={`p-5 text-center font-bold text-2xl ${isCurrent ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {period.data?.lesson}
                    </td>
                    <td className="p-5 text-center font-mono whitespace-nowrap">
                      <div className={isCurrent ? 'text-emerald-300 font-bold' : 'text-slate-400'}>
                        {period.start} - {period.end}
                      </div>
                      {isCurrent && (
                        <div className="mt-2 text-sm text-emerald-400 font-mono bg-emerald-950/50 rounded px-2 py-1 inline-block border border-emerald-800/50">
                          {countdown}
                        </div>
                      )}
                    </td>
                    {period.data?.subjects.map((subject, i) => (
                      <td key={i} className={`p-5 border-l border-slate-700/50 ${isCurrent ? 'text-white font-medium' : ''}`}>
                        {subject || <span className="text-slate-700">-</span>}
                      </td>
                    ))}
                  </tr>
                );
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
