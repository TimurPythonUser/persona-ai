import type { StaticImageData } from "next/image";

// Картинки импортируются статически: Next сам подставит размеры и blur-превью,
// а при замене файла в public/bloggers/{id}/ после пересборки подтянется новая версия.
import markAvatar from "../../public/bloggers/mark/avatar.webp";
import markPost1 from "../../public/bloggers/mark/post-1.webp";
import markPost2 from "../../public/bloggers/mark/post-2.webp";
import markPost3 from "../../public/bloggers/mark/post-3.webp";
import danAvatar from "../../public/bloggers/dan/avatar.webp";
import danPost1 from "../../public/bloggers/dan/post-1.webp";
import danPost2 from "../../public/bloggers/dan/post-2.webp";
import danPost3 from "../../public/bloggers/dan/post-3.webp";
import aliceAvatar from "../../public/bloggers/alice/avatar.webp";
import alicePost1 from "../../public/bloggers/alice/post-1.webp";
import alicePost2 from "../../public/bloggers/alice/post-2.webp";
import alicePost3 from "../../public/bloggers/alice/post-3.webp";
import miyaAvatar from "../../public/bloggers/miya/avatar.webp";
import miyaPost1 from "../../public/bloggers/miya/post-1.webp";
import miyaPost2 from "../../public/bloggers/miya/post-2.webp";
import miyaPost3 from "../../public/bloggers/miya/post-3.webp";

export type Post = {
  image: StaticImageData;
  /** Описание картинки для скринридеров. */
  alt: string;
  caption: string;
  likes: number;
};

export type QuickReply = {
  label: string;
  answer: string;
};

export type Blogger = {
  id: string;
  name: string;
  handle: string;
  niche: string;
  tagline: string;
  bio: string;
  /** Основной акцент: бейджи, кнопки, свечение. */
  accentColor: string;
  /** Вторая точка градиента для обложки и glow. */
  accentColorAlt: string;
  followers: number;
  /** Количество публикаций (число для статистики). */
  posts: number;
  /** Вовлечённость, %. */
  engagement: number;
  avatar: StaticImageData;
  /** Посты для ленты в профиле. */
  feed: Post[];
  chat: {
    intro: string[];
    quickReplies: QuickReply[];
  };
  fallbackReply: string;
};

export const bloggers: Blogger[] = [
  {
    id: "mark",
    name: "Марк Ривер",
    handle: "@mark.builds",
    niche: "Tech & AI",
    tagline: "Строю AI-продукты и показываю, как это устроено изнутри",
    bio: "Фаундер, 30. Третий стартап — первый, за который не стыдно. Пишу про AI, продукт и как запускать быстрее, чем успеваешь передумать.",
    accentColor: "#38bdf8",
    accentColorAlt: "#6366f1",
    followers: 284_000,
    posts: 1_240,
    engagement: 6.8,
    avatar: markAvatar,
    feed: [
      {
        image: markPost1,
        alt: "Марк на крыше на фоне ночного города",
        caption: "23:40, крыша офиса. Релиз выкатили, город ещё не спит — я тоже 🌃",
        likes: 18_420,
      },
      {
        image: markPost2,
        alt: "Марк выступает на сцене tech-конференции",
        caption: "Показал на сцене демо, которое вчера ещё падало. Сегодня — нет. Это и есть продакшн.",
        likes: 24_910,
      },
      {
        image: markPost3,
        alt: "Марк работает за ноутбуком в кофейне",
        caption: "Офис на сегодня — кофейня за углом. Флэт уайт, ноутбук и три часа без созвонов ☕",
        likes: 12_305,
      },
    ],
    chat: {
      intro: [
        "Привет! Я Марк 👋",
        "Строю AI-продукты и делюсь тем, что реально работает. Без хайпа и курсов за 300к.",
        "Спрашивай про стартапы, нейросети или как не выгореть к третьему релизу.",
      ],
      quickReplies: [
        {
          label: "С чего начать в AI?",
          answer:
            "Не с курсов. Возьми скучную задачу, которую делаешь руками каждую неделю, и автоматизируй её с LLM за выходные. Один живой прототип научит больше, чем десять вебинаров.",
        },
        {
          label: "Какой у тебя стек?",
          answer:
            "Next.js на фронте, Python для всего, что трогает модели, Postgres и пара агентов, которые пишут тесты за меня. Скучно, надёжно, быстро.",
        },
        {
          label: "Где искать идею?",
          answer:
            "Ищи боль, за которую люди уже платят деньгами или временем. Если твоя идея никого не бесит — она никому и не нужна.",
        },
      ],
    },
    fallbackReply:
      "Хороший вопрос — коротким ответом тут не отделаешься. Давай разберём в Telegram, там я отвечаю быстрее, чем деплоится прод 😄",
  },
  {
    id: "dan",
    name: "Дэн Кросс",
    handle: "@dan.outdoors",
    niche: "Спорт и travel",
    tagline: "Горы на рассвете, волна на закате, дорога между ними",
    bio: "27, полгода живу в кемпере. Сёрф, треккинг, сплитборд. Показываю маршруты, которых нет в путеводителях.",
    accentColor: "#fb923c",
    accentColorAlt: "#f43f5e",
    followers: 236_000,
    posts: 980,
    engagement: 8.2,
    avatar: danAvatar,
    feed: [
      {
        image: danPost1,
        alt: "Дэн на горной вершине на рассвете",
        caption: "Четыре часа подъёма в темноте ради этих десяти минут. Стоило каждого шага 🏔️",
        likes: 31_240,
      },
      {
        image: danPost2,
        alt: "Дэн ловит волну на сёрфборде",
        caption: "Вода +14, волна два метра, улыбка до ушей. Утро удалось 🌊",
        likes: 27_815,
      },
      {
        image: danPost3,
        alt: "Дэн у костра возле палатки под звёздным небом",
        caption: "Дом там, где ставишь палатку. Сегодня — под миллионом звёзд 🔥",
        likes: 19_603,
      },
    ],
    chat: {
      intro: [
        "Йо! Дэн на связи 🤙",
        "Сейчас в горах, сеть ловит через раз, но для тебя найду.",
        "Нужен маршрут, совет по снаряге или просто пинок встать с дивана?",
      ],
      quickReplies: [
        {
          label: "Куда поехать впервые?",
          answer:
            "Начни с Грузии: пара дней в Казбеги, потом Сванетия. Красиво, недорого, люди золотые. Палатку можно взять в прокате прямо в Тбилиси.",
        },
        {
          label: "Как начать сёрфить?",
          answer:
            "Бери софтборд, школу на 3–5 занятий и пляж с песчаным дном. Первые дни ловишь пену и учишься вставать. Португалия или Шри-Ланка — идеально.",
        },
        {
          label: "Что взять в поход?",
          answer:
            "Три правила: слои вместо одной тёплой куртки, налобник всегда с собой и уже разношенные ботинки. Остальное — мелочи.",
        },
      ],
    },
    fallbackReply:
      "Ха, зачётный вопрос! Тут сигнал на одну палку — давай лучше в Telegram, скину маршрут и фотки с места 📍",
  },
  {
    id: "alice",
    name: "Алиса Морен",
    handle: "@alice.mode",
    niche: "Fashion",
    tagline: "Стиль — способ сказать, кто ты, не открывая рта",
    bio: "25, стилист, живу между Парижем и бэкстейджами. Разбираю тренды без снобизма и собираю образы, которые можно носить не только на подиуме.",
    accentColor: "#f472b6",
    accentColorAlt: "#c026d3",
    followers: 391_000,
    posts: 2_310,
    engagement: 7.4,
    avatar: aliceAvatar,
    feed: [
      {
        image: alicePost1,
        alt: "Алиса в кожаной куртке и серых брюках идёт по парижской улице",
        caption: "Кожанка, широкие брюки и лоферы — городская униформа, которая ещё ни разу не подвела 🖤",
        likes: 42_130,
      },
      {
        image: alicePost2,
        alt: "Алиса с капучино и круассаном в парижском кафе",
        caption: "Круассан, капучино и полосатый лонгслив — весь Париж в одном кадре 🥐",
        likes: 38_702,
      },
      {
        image: alicePost3,
        alt: "Алиса в шёлковом платье-комбинации делает селфи в зеркале",
        caption: "Платье-комбинация — must-have сезона. Днём с грубыми ботинками, вечером с каблуками ✨",
        likes: 29_514,
      },
    ],
    chat: {
      intro: [
        "Приветик! Я Алиса 💋",
        "Только что с примерки, так что настроение — поболтать про стиль.",
        "Спрашивай: что надеть, что выбросить и что скоро вернётся в моду.",
      ],
      quickReplies: [
        {
          label: "Что сейчас в тренде?",
          answer:
            "Мягкий тейлоринг, бордовый вместо чёрного и сумки с характером. И да, широкие джинсы никуда не уходят — выдыхаем.",
        },
        {
          label: "Собери базовый гардероб",
          answer:
            "Белая рубашка, хороший тренч, прямые джинсы, чёрные брюки, кашемировый джемпер и лоферы. Десять вещей — тридцать образов.",
        },
        {
          label: "Как найти свой стиль?",
          answer:
            "Сохрани 30 образов, которые цепляют, и найди, что их объединяет. Это и есть ты. Остальное — просто шум.",
        },
      ],
    },
    fallbackReply:
      "Ооо, тут нужен персональный разбор, а не ответ в двух словах 💅 Пиши в Telegram — посмотрим твой гардероб вместе.",
  },
  {
    id: "miya",
    name: "Мия Сато",
    handle: "@miya.daily",
    niche: "Lifestyle & wellness",
    tagline: "Маленькие ритуалы, которые делают день спокойнее",
    bio: "26, Токио → весь мир. Йога, матча, дневники и мягкая продуктивность. Без марафонов и чувства вины.",
    accentColor: "#34d399",
    accentColorAlt: "#14b8a6",
    followers: 312_000,
    posts: 1_670,
    engagement: 9.1,
    avatar: miyaAvatar,
    feed: [
      {
        image: miyaPost1,
        alt: "Мия медитирует на коврике в светлой комнате",
        caption: "15 минут на коврике до того, как открыть телефон. Лучший апгрейд утра 🧘‍♀️",
        likes: 33_418,
      },
      {
        image: miyaPost2,
        alt: "Мия с матча-латте, ягодным боулом и дневником за завтраком",
        caption: "Матча, боул с ягодами и никакой спешки. Завтрак как маленькая медитация 🍵",
        likes: 28_907,
      },
      {
        image: miyaPost3,
        alt: "Мия гуляет по осеннему парку с кофе",
        caption: "Осенний парк, кофе с собой и ни одного уведомления. Так выглядит мой перезапуск 🍂",
        likes: 21_736,
      },
    ],
    chat: {
      intro: [
        "Привет 🌿 Я Мия.",
        "Сделай глубокий вдох. Вот так — уже лучше.",
        "Подскажу утренний ритуал, рецепт или как сбавить скорость, когда всё горит.",
      ],
      quickReplies: [
        {
          label: "Утренний ритуал",
          answer:
            "Стакан тёплой воды, десять минут растяжки и три строчки в дневник. Телефон — только после. Попробуй неделю, обратно не захочется.",
        },
        {
          label: "Как снять стресс?",
          answer:
            "Дыхание 4-7-8: вдох на 4 счёта, задержка на 7, выдох на 8. Четыре круга — и нервная система вспоминает, что всё в порядке.",
        },
        {
          label: "Рецепт матча-латте",
          answer:
            "Две ложечки матчи, 60 мл воды 80°, взбить венчиком до пенки. Добавь 150 мл тёплого овсяного молока и каплю мёда. Готово 🍵",
        },
      ],
    },
    fallbackReply: "Какой тёплый вопрос 🌸 Давай продолжим в Telegram — там спокойнее, и я отвечу подробно.",
  },
];

export const totalReach = bloggers.reduce((sum, b) => sum + b.followers, 0);

export function getBlogger(id: string | null | undefined) {
  return bloggers.find((b) => b.id === id) ?? null;
}
