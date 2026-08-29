/* Design philosophy: واحة مائية معاصرة — editorial Gulf hospitality, warm ivory/sand surfaces, Gulf turquoise accents, asymmetric composition, calm purposeful motion. */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  ArrowUpLeft,
  Check,
  ChevronDown,
  Droplets,
  Facebook,
  HardHat,
  Instagram,
  MapPin,
  Music2,
  Menu,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Waves,
  Wrench,
  X,
} from "lucide-react";

const phone = "0555991700";
const whatsapp = "https://wa.me/971555991700?text=" + encodeURIComponent("مرحبًا، أرغب في حجز خدمة للمسبح في أبوظبي.");
const facebook = "https://www.facebook.com/himat.alkhalij.2025";
const instagram = "https://www.instagram.com/alkhalijhimat";
const tiktok = "https://www.tiktok.com/@himatalkhalij";
const logoUrl = "https://halkhalij.github.io/halkhalij/assets/himmat-official-logo-cropped.png";
const mediaBase = "https://halkhalij.github.io/halkhalij/assets/media";

const services = [
  {
    number: "01",
    title: "إنشاء وتصميم المسابح",
    text: "من الفكرة الأولى حتى آخر تفصيلة، نصمم مسبحًا ينسجم مع بيتك وطريقة استخدامك.",
    image: `${mediaBase}/himmat-real-pool-finish_7a066c0c.jpg`,
    icon: HardHat,
  },
  {
    number: "02",
    title: "تنظيف احترافي",
    text: "مياه صافية، حواف نظيفة، وعناية دقيقة تعيد للمسبح إحساسه المنعش طوال العام.",
    image: `${mediaBase}/himmat-real-water-detail_ed154fee.jpg`,
    icon: Sparkles,
  },
  {
    number: "03",
    title: "صيانة وفحص دوري",
    text: "نتابع الفلاتر والمضخات والمياه بخطة واضحة تقلل الأعطال وتحافظ على سلامة السباحة.",
    image: `${mediaBase}/himmat-real-detail-2_a12d3e8b.jpg`,
    icon: Wrench,
  },
];

function LogoMark() {
  const [failed, setFailed] = useState(false);
  return failed ? <span className="brand-mark logo-fallback" aria-hidden="true"><span className="mark-arc" /><span className="mark-wave" /></span> : <span className="brand-mark" aria-hidden="true"><img src={logoUrl} alt="همة الخليج لصيانة وتركيب المسابح" onError={() => setFailed(true)} /></span>;
}

const realProjects = [
  { title: "تشطيب مسبح", label: "نقاء المياه وجودة التشطيب", src: `${mediaBase}/2_5226677566588362962_83de67d3.mp4`, mediaType: "video" as const },
  { title: "مسبح وجلسة", label: "تنفيذ متكامل للمسبح والحديقة", src: `${mediaBase}/2_5226677566588362963_c6fc4926.mp4`, mediaType: "video" as const },
];

const faqs = [
  ["هل تقدمون خدماتكم داخل أبوظبي؟", "نعم، نعمل في أبوظبي وننسق معكم لتحديد الموقع والموعد المناسب قبل الزيارة."],
  ["هل يمكن حجز تنظيف لمرة واحدة؟", "بالتأكيد. نوفر تنظيفًا لمرة واحدة، كما يمكن ترتيب زيارات دورية بحسب احتياج المسبح."],
  ["كيف أحصل على عرض سعر؟", "أرسل لنا موقعك وصورة أو وصفًا بسيطًا للمسبح عبر واتساب، وسنعود لك بالتفاصيل المناسبة."],
];

function getServiceIcon(key: string) {
  if (key === "hardhat") return HardHat;
  if (key === "wrench") return Wrench;
  return Sparkles;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dbServices = trpc.publicContent.services.useQuery();
  const dbProjects = trpc.publicContent.projects.useQuery();
  const dbReviews = trpc.publicContent.reviews.useQuery();
  const serviceItems = dbServices.data?.length ? dbServices.data.map((item, index) => ({ number: String(index + 1).padStart(2, "0"), title: item.title, text: item.description, image: item.imageUrl ?? "", icon: getServiceIcon(item.iconKey) })) : services;
  const projectItems = dbProjects.data?.length ? dbProjects.data.map(item => ({ title: item.title, label: item.label ?? "", src: item.mediaUrl, mediaType: item.mediaType })) : realProjects;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div dir="rtl" className="site-shell">
      <a className="skip-link" href="#main-content">انتقل إلى المحتوى</a>
      <header className="topbar">
        <div className="container topbar-inner">
          <button className="brand" onClick={() => scrollTo("top")} aria-label="العودة إلى بداية الموقع">
            <LogoMark />
          </button>
          <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="التنقل الرئيسي">
            <button onClick={() => scrollTo("services")}>خدماتنا</button><button onClick={() => scrollTo("projects")}>أعمالنا</button>
            <button onClick={() => scrollTo("offer")}>العرض الحالي</button>
            <button onClick={() => scrollTo("process")}>كيف نعمل</button>
            <button onClick={() => scrollTo("reviews")}>آراء العملاء</button>
            <a className="nav-call" href={`tel:${phone}`}><Phone size={16} /> اتصل بنا</a>
          </nav>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"} aria-expanded={menuOpen}>
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </header>

      <main id="main-content">
        <section id="top" className="hero">
          <div className="hero-overlay" />
          <div className="container hero-content">
            <div className="hero-copy reveal">
              <div className="eyebrow"><span className="eyebrow-line" /> أبوظبي والإمارات</div>
              <h1>من أول غطسة،<br /><em>تبدأ الجودة.</em></h1>
              <p>نبني ونعتني بالمسابح التي تجعل كل يوم في البيت أجمل. تصميم متقن، مياه صافية، وصيانة تريح بالك.</p>
              <div className="hero-actions">
                <a className="button button-primary" href={whatsapp} target="_blank" rel="noreferrer"><Waves size={18} /> احجز عبر واتساب <ArrowLeft size={17} /></a>
                <a className="button button-ghost" href={`tel:${phone}`}><Phone size={17} /> {phone}</a>
              </div>
              <div className="hero-note"><ShieldCheck size={17} /> معاينة أولية وتواصل مباشر بدون تعقيد</div><span className="local-badge">أبوظبي والإمارات</span>
            </div>
            <div className="hero-stamp"><span>POOL CARE</span><strong>01</strong><small>نحو مسبح<br />أنظف وأجمل</small></div>
          </div>
          <div className="hero-scroll">مرّر لاكتشاف خدماتنا <ArrowUpLeft size={16} /></div>
        </section>

        <section className="trust-band">
          <div className="container trust-grid">
            <div className="trust-intro"><span className="section-kicker">لماذا همة الخليج؟</span><strong>حلول واضحة<br />ونتيجة تلاحظها.</strong></div>
            <div className="trust-item"><span className="trust-icon"><ShieldCheck /></span><div><b>أمان وعناية</b><small>اهتمام بالتفاصيل التي تحميك</small></div></div>
            <div className="trust-item"><span className="trust-icon"><Droplets /></span><div><b>مياه صافية</b><small>تنظيف وفحص بمعايير دقيقة</small></div></div>
            <div className="trust-item"><span className="trust-icon"><MapPin /></span><div><b>من أبوظبي</b><small>خدمة محلية تصل إليك</small></div></div>
          </div>
        </section>

        <section id="services" className="section services-section">
          <div className="container">
            <div className="section-heading split-heading"><div><span className="section-kicker">خدماتنا</span><h2>المسبح الجميل<br /><span>يبدأ من العناية.</span></h2></div><p>سواء كنت تبدأ من الصفر أو تريد استعادة بريق مسبحك، نضع خبرتنا في خدمتك بحلول عملية وتكلفة مدروسة.</p></div>
            <div className="services-list">
              {serviceItems.map(({ number, title, text, image, icon: Icon }) => (
                <article className="service-card" key={number}>
                  <div className="service-visual"><img src={image} alt={title} /><span className="service-number">{number}</span></div>
                  <div className="service-copy"><span className="service-icon"><Icon size={21} /></span><h3>{title}</h3><p>{text}</p><a href={whatsapp} target="_blank" rel="noreferrer" className="text-link">اطلب الخدمة <ArrowLeft size={16} /></a></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="section projects-section">
          <div className="container projects-grid">
            <div className="projects-intro"><span className="section-kicker">أعمالنا على أرض الواقع</span><h2>شوف الجودة<br /><span>قبل ما تحجز.</span></h2><p>هذه لقطات حقيقية من تنفيذ همة الخليج. شاهد التفاصيل بنفسك، ثم أرسل لنا صورة مسبحك لنقترح لك البداية المناسبة.</p><a className="button button-instagram project-social-cta" href={instagram} target="_blank" rel="noreferrer"><Instagram size={18} /> تابع أحدث أعمالنا <ArrowLeft size={17} /></a><span className="project-line" aria-hidden="true" /></div>
            <div className="project-reels">{projectItems.map((project, index) => <article className="project-video-card" key={project.src}><div className="project-video-frame">{project.mediaType === "image" ? <img src={project.src} alt={project.title} /> : <video controls playsInline preload="metadata" aria-label={project.title}><source src={project.src} type="video/mp4" />متصفحك لا يدعم تشغيل الفيديو.</video>}<span className="project-index">0{index + 1}</span></div><div className="project-meta"><div><span>{project.label}</span><h3>{project.title}</h3></div><a href={whatsapp} target="_blank" rel="noreferrer" aria-label={`احجز مشروع ${project.title}`}><ArrowLeft size={17} /></a></div></article>)}</div>
          </div>
        </section>

        <section id="offer" className="offer-section">
          <div className="container offer-inner">
            <div className="offer-copy"><span className="section-kicker light">عرض الموسم</span><h2>خلّي مسبحك<br /><i>جاهزًا للصيف.</i></h2><p>تنظيف شامل بأحدث التقنيات، وفريق محترف يترك المياه صافية والنظافة ملموسة.</p><a className="button button-light" href={whatsapp} target="_blank" rel="noreferrer">احجز العرض الآن <ArrowLeft size={17} /></a></div>
            <div className="offer-badge"><span>خصم</span><strong>خيالي</strong><small>لفترة محدودة فقط</small></div>
            <div className="offer-wave" aria-hidden="true"><Waves size={116} strokeWidth={0.8} /></div>
          </div>
        </section>

        <section id="process" className="section process-section">
          <div className="container process-grid"><div className="process-title"><span className="section-kicker">بكل بساطة</span><h2>من الرسالة<br />إلى <span>الغطسة.</span></h2><p>نختصر عليك الطريق بثلاث خطوات واضحة، ونبقى قريبين منك في كل مرحلة.</p></div><div className="steps"><div className="step"><span>01</span><div><h3>تواصل معنا</h3><p>اتصل أو أرسل موقعك وصورة للمسبح عبر واتساب.</p></div></div><div className="step"><span>02</span><div><h3>نعاين ونقترح</h3><p>نفهم احتياجك ونوضح لك الحل والتكلفة قبل البدء.</p></div></div><div className="step"><span>03</span><div><h3>ننجز ونعتني</h3><p>فريقنا ينفذ العمل بعناية ويترك المكان جاهزًا.</p></div></div></div></div>
        </section>

        <section id="reviews" className="section reviews-section">
          <div className="container reviews-inner"><div className="reviews-copy"><span className="section-kicker">آراء عملائنا</span><h2>تجربتك تصنع<br /><span>الفرق.</span></h2><p>نؤمن أن أفضل تقييم هو ما يكتبه عميلنا بنفسه. شاركنا تجربتك الحقيقية بعد الخدمة، لنساعد عملاء أبوظبي على اختيارهم بثقة.</p><div className="rating-prompt"><div className="stars" aria-label="ننتظر تقييمك"><Star /><Star /><Star /><Star /><Star /></div><b>ننتظر رأيك الحقيقي</b></div><a className="button button-turquoise" href={whatsapp} target="_blank" rel="noreferrer">أرسل تقييمك عبر واتساب <ArrowLeft size={17} /></a></div>{dbReviews.data?.length ? <div className="review-list">{dbReviews.data.map(review => <article className="review-empty" key={review.id}><div className="review-quote">“</div><h3>{review.customerName}</h3><p>{review.body}</p><div className="stars" aria-label={`${review.rating} من 5`}><Star /><Star /><Star /><Star /><Star /></div></article>)}</div> : <div className="review-empty"><div className="review-quote">“</div><h3>نستقبل تجربتك</h3><p>أرسل تقييمك الحقيقي عبر واتساب، وبعد موافقتك يمكننا نشره هنا بكل شفافية واعتزاز.</p><a href={whatsapp} target="_blank" rel="noreferrer" className="text-link">شارك تجربتك <ArrowLeft size={16} /></a></div>}</div>
        </section>

        <section className="section faq-section"><div className="container faq-grid"><div><span className="section-kicker">أسئلة سريعة</span><h2>قبل ما<br /><span>تتواصل.</span></h2></div><div className="faq-list">{faqs.map(([q, a], i) => <div className={openFaq === i ? "faq-item open" : "faq-item"} key={q}><button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}><span>{q}</span><ChevronDown size={19} /></button><div className="faq-answer"><p>{a}</p></div></div>)}</div></div></section>

        <section className="contact-cta"><div className="container contact-inner"><div><span className="section-kicker light">جاهز للماء الصافي؟</span><span className="local-badge light-badge">أبوظبي والإمارات</span><h2>خلّنا نبدأ<br /><i>من مسبحك.</i></h2></div><div className="contact-actions"><a className="button button-light" href={whatsapp} target="_blank" rel="noreferrer"><Waves size={18} /> واتساب الحجز</a><a className="contact-phone" href={`tel:${phone}`}><Phone size={18} /><span><small>اتصل مباشرة</small>{phone}</span></a></div></div></section>
      </main>

      <footer className="footer"><div className="container footer-inner"><div className="brand footer-brand"><LogoMark /></div><p>حلول متكاملة للمسابح في أبوظبي والإمارات.</p><div className="social-links"><a className="social-link facebook-link" href={facebook} target="_blank" rel="noreferrer" aria-label="صفحة همة الخليج على فيسبوك"><Facebook size={17} /><span>فيسبوك</span></a><a className="social-link instagram-link" href={instagram} target="_blank" rel="noreferrer" aria-label="صفحة همة الخليج على إنستغرام"><Instagram size={17} /><span>إنستغرام</span></a><a className="social-link tiktok-link" href={tiktok} target="_blank" rel="noreferrer" aria-label="صفحة همة الخليج على تيك توك"><Music2 size={17} /><span>تيك توك</span></a></div><span className="copyright">© 2026 همة الخليج</span></div></footer>
      <a className="floating-wa" href={whatsapp} target="_blank" rel="noreferrer" aria-label="تواصل عبر واتساب"><span>واتساب الحجز</span><Waves size={25} /></a>
    </div>
  );
}
