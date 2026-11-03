(() => {
const ID="clicksimple-host", old=document.getElementById(ID);
if(old){old.shadowRoot.querySelector(".cs-panel").classList.toggle("cs-hidden");return;}
const host=document.createElement("div");host.id=ID;host.style.cssText="all:initial;position:fixed;z-index:2147483647;top:18px;right:18px";
document.documentElement.appendChild(host);const sh=host.attachShadow({mode:"open"});

const SYNONYMS = {
  "password": ["pass", "login", "security", "credential", "auth", "reset", "secret"],
  "account": ["profile", "user", "my account", "dashboard", "settings"],
  "billing": ["payment", "card", "invoice", "receipt", "order", "purchase", "subscription", "pay", "checkout"],
  "help": ["support", "faq", "contact", "customer service", "assistance"],
  "email": ["mail", "address", "contact info"],
  "search": ["find", "lookup", "explore", "query"],
  "form": ["input", "submit", "details", "register", "signup", "apply"],
  "registration": ["register", "signup", "enroll", "enrollment", "application", "join"],
  "subject": ["course", "class", "module", "topic", "discipline"]
};

const KEYS=["tag", "question", "intro", "form", "formDesc", "find", "findDesc", "nav", "navDesc", "custom", "customDesc", "placeholder", "findBtn", "back", "next", "finish", "step", "why", "reason", "note", "noMatch", "noFields", "noNav", "searchTitle", "goalTitle", "empty", "filterPlaceholder", "deepSearchNote"], DATA={"en": ["LANGUAGE", "What would you like to do?", "Choose a task. ClickSimple will guide you through this page one step at a time.", "Fill out a form", "Inspect form fields, search inputs & understand required items.", "Find something", "Search this page and get guided to other pages when needed.", "Navigate this website", "Explore useful links, buttons and key sections.", "Describe my task", "Tell us what you're trying to accomplish.", "What are you looking for?", "Find it", "Back to tasks", "Next result →", "Finish", "RESULT", "Why am I seeing this?", "This item may be relevant because of its label or nearby text. Check the guidance before acting.", "Review the highlighted item. You stay in control of every click.", "I couldn't find a clear match on this page or inside embedded frames.", "I couldn't find visible form fields on this page.", "I couldn't find visible links or buttons on this page.", "Search this page", "What are you trying to do?", "Please enter something to search for.", "Filter form fields...", "Looking in embedded pages & sub-sections..."], "hi": ["भाषा", "आप क्या करना चाहते हैं?", "एक काम चुनें। ClickSimple आपको मार्गदर्शन करेगा।", "फ़ॉर्म भरें", "फ़ॉर्म फ़ील्ड और इनपुट खोजें।", "कुछ खोजें", "इस पेज पर खोजें और ज़रूरत पड़ने पर अगले पेज तक मार्गदर्शन पाएँ।", "वेबसाइट देखें", "लिंक और बटन देखें।", "काम बताएँ", "बताएँ कि आप क्या करना चाहते हैं।", "आप क्या खोज रहे हैं?", "खोजें", "पीछे जाएँ", "अगला →", "समाप्त", "परिणाम", "यह क्यों दिख रहा है?", "इसका नाम या आसपास का पाठ आपके काम से संबंधित हो सकता है। आगे बढ़ने से पहले विवरण देखें।", "हाइलाइट की गई चीज़ देखें।", "कोई परिणाम नहीं मिला।", "फ़ॉर्म नहीं मिला।", "लिंक या बटन नहीं मिले।", "पेज पर खोजें", "आप क्या करना चाहते हैं?", "कृपया कुछ लिखें।", "फ़िल्टर फ़ॉर्म फ़ील्ड...", "एंबेडेड पेजों में खोज जारी है..."], "zh": ["语言", "你想做什么？", "选择一项任务。ClickSimple 会一步一步引导你。", "填写表单", "查看并搜索表单字段。", "查找内容", "搜索此页面；需要时，ClickSimple 会引导你前往其他页面。", "浏览此网站", "探索有用的链接和按钮。", "描述我的任务", "告诉我们你想完成什么。", "你要查找什么？", "查找", "返回", "下一个 →", "完成", "结果", "为什么显示这个？", "此项目的名称或附近文字可能与您的目标有关。操作前请先查看说明。", "请检查高亮内容。", "未找到明确匹配项。", "没有找到表单字段。", "没有找到链接或按钮。", "搜索此页面", "你想做什么？", "请输入搜索内容。", "筛选表单字段...", "正在嵌入页面中搜索..."], "es": ["IDIOMA", "¿Qué te gustaría hacer?", "Elige una tarea. ClickSimple te guiará paso a paso.", "Rellenar un formulario", "Inspeccionar y buscar campos de formulario.", "Buscar algo", "Busca en esta página y recibe guía hacia otras páginas cuando sea necesario.", "Navegar por este sitio", "Explora enlaces y botones útiles.", "Describe mi tarea", "Dinos qué quieres lograr.", "¿Qué estás buscando?", "Buscar", "Volver", "Siguiente →", "Terminar", "RESULTADO", "¿Por qué aparece esto?", "El nombre o el texto cercano pueden estar relacionados con tu objetivo. Revisa la explicación antes de continuar.", "Revisa el elemento resaltado.", "No se encontró coincidencia.", "No hay formularios visibles.", "No hay enlaces o botones visibles.", "Buscar en esta página", "¿Qué quieres hacer?", "Escribe algo para buscar.", "Filtrar campos...", "Buscando en páginas integradas..."], "ar": ["اللغة", "ماذا تريد أن تفعل؟", "اختر مهمة. سيرشدك ClickSimple خطوة بخطوة.", "ملء نموذج", "افحص وابحث في حقول النموذج.", "ابحث عن شيء", "ابحث في هذه الصفحة واحصل على إرشاد إلى صفحات أخرى عند الحاجة.", "تصفح هذا الموقع", "استكشف الروابط والأزرار المفيدة.", "صف مهمتي", "أخبرنا بما تريد إنجازه.", "ما الذي تبحث عنه؟", "بحث", "عودة", "النتيجة التالية ←", "إنهاء", "النتيجة", "لماذا تظهر هذه النتيجة؟", "قد يكون الاسم أو النص القريب مرتبطاً بهدفك. راجع الشرح قبل المتابعة.", "راجع العنصر المميز.", "لم نجد تطابقاً واضحاً.", "لم نجد حقول نموذج ظاهرة.", "لم نجد روابط أو أزرار ظاهرة.", "ابحث في هذه الصفحة", "ماذا تريد أن تفعل؟", "يرجى كتابة كلمة البحث.", "صفّ حقول النموذج...", "جاري البحث في الصفحات المضمنة..."], "fr": ["LANGUE", "Que souhaitez-vous faire ?", "Choisissez une tâche. ClickSimple vous guidera étape par étape.", "Remplir un formulaire", "Inspecter et rechercher les champs.", "Trouver quelque chose", "Rechercher sur cette page et être guidé vers d’autres pages si nécessaire.", "Naviguer sur ce site", "Explorer les liens et boutons utiles.", "Décrire ma tâche", "Dites-nous votre objectif.", "Que recherchez-vous ?", "Rechercher", "Retour", "Suivant →", "Terminer", "RÉSULTAT", "Pourquoi ce résultat ?", "Le libellé ou le texte voisin peut être lié à votre objectif. Consultez l’explication avant d’agir.", "Vérifiez l'élément surligné.", "Aucune correspondance trouvée.", "Aucun champ de formulaire trouvé.", "Aucun lien ou bouton trouvé.", "Rechercher sur cette page", "Que souhaitez-vous faire ?", "Veuillez saisir un terme.", "Filtrer les champs...", "Recherche dans les pages intégrées..."], "bn": ["ভাষা", "আপনি কী করতে চান?", "একটি কাজ বেছে নিন। ClickSimple আপনাকে সাহায্য করবে।", "ফর্ম পূরণ করুন", "ফর্মের ঘর অনুসন্ধান ও পর্যবেক্ষণ করুন।", "কিছু খুঁজুন", "এই পৃষ্ঠায় খুঁজুন এবং প্রয়োজনে অন্য পৃষ্ঠায় যাওয়ার নির্দেশনা পান।", "ওয়েবসাইট ঘুরে দেখুন", "প্রয়োজনীয় লিংক ও বোতাম খুঁজুন।", "আমার কাজটি বলুন", "আপনার লক্ষ্য জানান।", "আপনি কী খুঁজছেন?", "খুঁজুন", "পিছনে", "পরের →", "শেষ", "ফলাফল", "কেন দেখানো হচ্ছে?", "এর নাম বা কাছের লেখা আপনার লক্ষ্যের সঙ্গে সম্পর্কিত হতে পারে। এগোনোর আগে ব্যাখ্যাটি দেখুন।", "হাইলাইট করা অংশটি দেখুন।", "কোন মিল পাওয়া যায়নি।", "ফর্ম পাওয়া যায়নি।", "লিংক বা বোতাম পাওয়া যায়নি।", "পৃষ্ঠায় খুঁজুন", "আপনি কী করতে চান?", "অনুসন্ধানের শব্দ লিখুন।", "ফর্মের ঘর ফিল্টার করুন...", "এমবেড করা পাতায় খোঁজা হচ্ছে..."], "pt": ["IDIOMA", "O que você gostaria de fazer?", "Escolha uma tarefa. O ClickSimple guiará você.", "Preencher um formulário", "Inspecione e pesquise campos de formulário.", "Encontrar algo", "Pesquise nesta página e receba orientação para outras páginas quando necessário.", "Navegar neste site", "Explore links e botões úteis.", "Descrever minha tarefa", "Conte o que você quer fazer.", "O que você está procurando?", "Pesquisar", "Voltar", "Próximo →", "Concluir", "RESULTADO", "Por que este resultado?", "O rótulo ou o texto próximo pode estar relacionado ao seu objetivo. Confira a explicação antes de agir.", "Confira o item destacado.", "Nenhuma correspondência encontrada.", "Nenhum formulário visível.", "Nenhum link ou botão visível.", "Pesquisar na página", "O que você quer fazer?", "Digite algo para pesquisar.", "Filtrar campos...", "Pesquisando em páginas incorporadas..."], "ru": ["ЯЗЫК", "Что вы хотите сделать?", "Выберите задачу. ClickSimple поможет вам пошагово.", "Заполнить форму", "Проверяйте и ищите поля формы.", "Найти что-нибудь", "Поиск на этой странице с переходом к подсказкам для других страниц при необходимости.", "Навигация по сайту", "Изучите полезные ссылки и кнопки.", "Описать мою задачу", "Расскажите о вашей цели.", "Что вы ищете?", "Найти", "Назад", "Далее →", "Готово", "РЕЗУЛЬТАТ", "Почему этот результат?", "Название или соседний текст могут относиться к вашей цели. Проверьте пояснение перед действием.", "Проверьте выделенный элемент.", "Совпадений не найдено.", "Поля формы не найдены.", "Ссылки или кнопки не найдены.", "Поиск на странице", "Что вы хотите сделать?", "Введите текст для поиска.", "Фильтр полей формы...", "Поиск во встроенных страницах..."], "ur": ["زبان", "آپ کیا کرنا چاہتے ہیں؟", "ایک کام منتخب کریں۔ ClickSimple رہنمائی کرے گا۔", "فارم پُر کریں", "فارم کے خانے تلاش کریں اور دیکھیں۔", "کچھ تلاش کریں", "اس صفحے پر تلاش کریں اور ضرورت پڑنے پر دوسرے صفحات تک رہنمائی حاصل کریں۔", "ویب سائٹ پر جائیں", "مفید لنکس اور بٹن دیکھیں۔", "اپنا کام بیان کریں", "اپنا مقصد بتائیں۔", "آپ کیا تلاش کر رہے ہیں؟", "تلاش کریں", "واپس", "اگلا ←", "مکمل", "نتیجہ", "یہ کیوں دکھایا گیا؟", "اس کا نام یا آس پاس کا متن آپ کے مقصد سے متعلق ہو سکتا ہے۔ آگے بڑھنے سے پہلے وضاحت دیکھیں۔", "نمایاں حصہ دیکھیں۔", "کوئی نتیجہ نہیں ملا۔", "فارم کے خانے نہیں ملے۔", "لنکس یا بٹن نہیں ملے۔", "صفحے پر تلاش کریں", "آپ کیا کرنا چاہتے ہیں؟", "تلاش کے لیے کچھ لکھیں۔", "فارم فیلڈز فلٹر کریں...", "مضمن صفحات میں تلاش جاری ہے..."], "mr": ["भाषा", "तुम्हाला काय करायचे आहे?", "एखादे काम निवडा. ClickSimple तुम्हाला या पृष्ठावर टप्प्याटप्प्याने मार्गदर्शन करेल.", "फॉर्म भरा", "फॉर्ममधील फील्ड तपासा, इनपुट शोधा आणि आवश्यक माहिती समजून घ्या.", "काहीतरी शोधा", "या पृष्ठावर शोधा आणि गरज पडल्यास इतर पृष्ठांपर्यंत मार्गदर्शन मिळवा.", "या वेबसाइटवर नेव्हिगेट करा", "उपयुक्त दुवे, बटणे आणि महत्त्वाचे विभाग शोधा.", "माझे काम सांगा", "तुम्ही काय करण्याचा प्रयत्न करत आहात ते सांगा.", "तुम्ही काय शोधत आहात?", "शोधा", "कामांकडे परत", "पुढील परिणाम →", "पूर्ण", "परिणाम", "हे मला का दिसत आहे?", "या घटकाचे लेबल किंवा जवळचा मजकूर तुमच्या उद्दिष्टाशी संबंधित असू शकतो. कृती करण्यापूर्वी मार्गदर्शन तपासा.", "हायलाइट केलेला घटक तपासा. प्रत्येक क्लिकवर नियंत्रण तुमचेच आहे.", "या पृष्ठावर किंवा एम्बेड केलेल्या फ्रेममध्ये स्पष्ट जुळणारा परिणाम सापडला नाही.", "या पृष्ठावर दिसणारी फॉर्म फील्ड सापडली नाहीत.", "या पृष्ठावर दिसणारे दुवे किंवा बटणे सापडली नाहीत.", "या पृष्ठावर शोधा", "तुम्हाला काय करायचे आहे?", "कृपया शोधण्यासाठी काहीतरी लिहा.", "फॉर्म फील्ड फिल्टर करा...", "एम्बेड केलेली पृष्ठे आणि विभाग शोधत आहे..."], "te": ["భాష", "మీరు ఏమి చేయాలనుకుంటున్నారు?", "ఒక పనిని ఎంచుకోండి. ClickSimple ఈ పేజీలో దశలవారీగా మీకు మార్గనిర్దేశం చేస్తుంది.", "ఫారమ్ నింపండి", "ఫారమ్ ఫీల్డ్‌లను పరిశీలించండి, ఇన్‌పుట్‌లను వెతకండి, అవసరమైన వివరాలను అర్థం చేసుకోండి.", "ఏదైనా వెతకండి", "ఈ పేజీలో వెతకండి; అవసరమైతే ఇతర పేజీలకు వెళ్లేందుకు మార్గదర్శనం పొందండి.", "ఈ వెబ్‌సైట్‌లో నావిగేట్ చేయండి", "ఉపయోగకరమైన లింక్‌లు, బటన్‌లు మరియు ముఖ్యమైన విభాగాలను చూడండి.", "నా పనిని వివరించండి", "మీరు ఏమి చేయాలనుకుంటున్నారో చెప్పండి.", "మీరు ఏమి వెతుకుతున్నారు?", "వెతకండి", "పనులకు తిరిగి వెళ్లండి", "తదుపరి ఫలితం →", "ముగించు", "ఫలితం", "ఇది నాకు ఎందుకు కనిపిస్తోంది?", "ఈ అంశం పేరు లేదా దాని పక్కన ఉన్న వచనం మీ లక్ష్యానికి సంబంధించినదై ఉండవచ్చు. చర్య తీసుకునే ముందు సూచనలను పరిశీలించండి.", "హైలైట్ చేసిన అంశాన్ని పరిశీలించండి. ప్రతి క్లిక్‌పై నియంత్రణ మీ దగ్గరే ఉంటుంది.", "ఈ పేజీలో లేదా పొందుపరిచిన ఫ్రేమ్‌లలో స్పష్టమైన సరిపోలిక కనబడలేదు.", "ఈ పేజీలో కనిపించే ఫారమ్ ఫీల్డ్‌లు కనబడలేదు.", "ఈ పేజీలో కనిపించే లింక్‌లు లేదా బటన్‌లు కనబడలేదు.", "ఈ పేజీలో వెతకండి", "మీరు ఏమి చేయాలనుకుంటున్నారు?", "వెతకడానికి ఏదైనా నమోదు చేయండి.", "ఫారమ్ ఫీల్డ్‌లను వడపోసండి...", "పొందుపరిచిన పేజీలు మరియు విభాగాల్లో వెతుకుతోంది..."], "ta": ["மொழி", "நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?", "ஒரு பணியைத் தேர்ந்தெடுக்கவும். இந்தப் பக்கத்தில் ClickSimple படிப்படியாக வழிகாட்டும்.", "படிவத்தை நிரப்பவும்", "படிவப் புலங்களைப் பாருங்கள், உள்ளீடுகளைத் தேடுங்கள், தேவையான விவரங்களைப் புரிந்துகொள்ளுங்கள்.", "ஏதாவது ஒன்றைக் கண்டறியவும்", "இந்தப் பக்கத்தில் தேடுங்கள்; தேவைப்பட்டால் பிற பக்கங்களுக்குச் செல்ல வழிகாட்டுதல் பெறுங்கள்.", "இந்த இணையதளத்தில் வழிசெலுத்தவும்", "பயனுள்ள இணைப்புகள், பொத்தான்கள் மற்றும் முக்கியப் பகுதிகளைப் பாருங்கள்.", "என் பணியை விவரிக்கவும்", "நீங்கள் என்ன செய்ய முயற்சிக்கிறீர்கள் என்பதைச் சொல்லுங்கள்.", "நீங்கள் எதைத் தேடுகிறீர்கள்?", "தேடு", "பணிகளுக்குத் திரும்பு", "அடுத்த முடிவு →", "முடி", "முடிவு", "இது ஏன் எனக்குக் காட்டப்படுகிறது?", "இதன் பெயர் அல்லது அருகிலுள்ள உரை உங்கள் நோக்கத்துடன் தொடர்புடையதாக இருக்கலாம். செயல்படுவதற்கு முன் வழிகாட்டுதலைப் பாருங்கள்.", "தனிப்படுத்தப்பட்ட உருப்படியைப் பாருங்கள். ஒவ்வொரு கிளிக்கின் கட்டுப்பாடும் உங்களிடமே உள்ளது.", "இந்தப் பக்கத்திலோ உட்பொதிக்கப்பட்ட சட்டகங்களிலோ தெளிவான பொருத்தம் கிடைக்கவில்லை.", "இந்தப் பக்கத்தில் காணக்கூடிய படிவப் புலங்கள் கிடைக்கவில்லை.", "இந்தப் பக்கத்தில் காணக்கூடிய இணைப்புகள் அல்லது பொத்தான்கள் கிடைக்கவில்லை.", "இந்தப் பக்கத்தில் தேடு", "நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?", "தேடுவதற்கு ஏதாவது உள்ளிடவும்.", "படிவப் புலங்களை வடிகட்டு...", "உட்பொதிக்கப்பட்ட பக்கங்கள் மற்றும் பிரிவுகளில் தேடுகிறது..."], "gu": ["ભાષા", "તમે શું કરવા માંગો છો?", "એક કાર્ય પસંદ કરો. ClickSimple આ પેજ પર તમને પગલું-દર-પગલું માર્ગદર્શન આપશે.", "ફોર્મ ભરો", "ફોર્મનાં ક્ષેત્રો તપાસો, ઇનપુટ શોધો અને જરૂરી વિગતો સમજો.", "કંઈક શોધો", "આ પેજ પર શોધો અને જરૂર પડે ત્યારે બીજા પેજ સુધી માર્ગદર્શન મેળવો.", "આ વેબસાઇટમાં નેવિગેટ કરો", "ઉપયોગી લિંક્સ, બટનો અને મહત્વના વિભાગો શોધો.", "મારું કાર્ય જણાવો", "તમે શું કરવાનો પ્રયાસ કરી રહ્યા છો તે કહો.", "તમે શું શોધી રહ્યા છો?", "શોધો", "કાર્યો પર પાછા જાઓ", "આગળનું પરિણામ →", "પૂર્ણ કરો", "પરિણામ", "આ મને શા માટે દેખાય છે?", "આ વસ્તુનું લેબલ અથવા નજીકનો લખાણ તમારા હેતુ સાથે સંબંધિત હોઈ શકે છે. આગળ વધતા પહેલાં માર્ગદર્શન તપાસો.", "હાઇલાઇટ કરેલી વસ્તુ તપાસો. દરેક ક્લિકનું નિયંત્રણ તમારા હાથમાં છે.", "આ પેજ પર અથવા એમ્બેડ કરેલા ફ્રેમમાં સ્પષ્ટ મેળ મળ્યો નથી.", "આ પેજ પર દેખાતા ફોર્મ ક્ષેત્રો મળ્યા નથી.", "આ પેજ પર દેખાતી લિંક્સ અથવા બટનો મળ્યા નથી.", "આ પેજ પર શોધો", "તમે શું કરવા માંગો છો?", "શોધવા માટે કંઈક લખો.", "ફોર્મ ક્ષેત્રો ફિલ્ટર કરો...", "એમ્બેડ કરેલા પેજ અને વિભાગોમાં શોધી રહ્યું છે..."], "kn": ["ಭಾಷೆ", "ನೀವು ಏನು ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?", "ಒಂದು ಕೆಲಸವನ್ನು ಆಯ್ಕೆಮಾಡಿ. ClickSimple ಈ ಪುಟದಲ್ಲಿ ಹಂತ ಹಂತವಾಗಿ ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ.", "ಫಾರ್ಮ್ ಭರ್ತಿ ಮಾಡಿ", "ಫಾರ್ಮ್ ಕ್ಷೇತ್ರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ, ಇನ್‌ಪುಟ್‌ಗಳನ್ನು ಹುಡುಕಿ ಮತ್ತು ಅಗತ್ಯವಿರುವ ವಿವರಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.", "ಏನನ್ನಾದರೂ ಹುಡುಕಿ", "ಈ ಪುಟದಲ್ಲಿ ಹುಡುಕಿ; ಅಗತ್ಯವಿದ್ದರೆ ಇತರ ಪುಟಗಳಿಗೆ ಹೋಗಲು ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ.", "ಈ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ನ್ಯಾವಿಗೇಟ್ ಮಾಡಿ", "ಉಪಯುಕ್ತ ಲಿಂಕ್‌ಗಳು, ಬಟನ್‌ಗಳು ಮತ್ತು ಪ್ರಮುಖ ವಿಭಾಗಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.", "ನನ್ನ ಕೆಲಸವನ್ನು ವಿವರಿಸಿ", "ನೀವು ಏನು ಮಾಡಲು ಪ್ರಯತ್ನಿಸುತ್ತಿದ್ದೀರಿ ಎಂದು ತಿಳಿಸಿ.", "ನೀವು ಏನನ್ನು ಹುಡುಕುತ್ತಿದ್ದೀರಿ?", "ಹುಡುಕಿ", "ಕಾರ್ಯಗಳಿಗೆ ಹಿಂತಿರುಗಿ", "ಮುಂದಿನ ಫಲಿತಾಂಶ →", "ಮುಗಿಸಿ", "ಫಲಿತಾಂಶ", "ಇದು ನನಗೆ ಏಕೆ ಕಾಣುತ್ತಿದೆ?", "ಈ ಅಂಶದ ಲೇಬಲ್ ಅಥವಾ ಹತ್ತಿರದ ಪಠ್ಯವು ನಿಮ್ಮ ಉದ್ದೇಶಕ್ಕೆ ಸಂಬಂಧಿಸಿರಬಹುದು. ಮುಂದುವರಿಯುವ ಮೊದಲು ಮಾರ್ಗದರ್ಶನವನ್ನು ಪರಿಶೀಲಿಸಿ.", "ಹೈಲೈಟ್ ಮಾಡಿದ ಅಂಶವನ್ನು ಪರಿಶೀಲಿಸಿ. ಪ್ರತಿಯೊಂದು ಕ್ಲಿಕ್‌ನ ನಿಯಂತ್ರಣ ನಿಮ್ಮ ಕೈಯಲ್ಲಿದೆ.", "ಈ ಪುಟದಲ್ಲಿ ಅಥವಾ ಎಂಬೆಡ್ ಮಾಡಿದ ಫ್ರೇಮ್‌ಗಳಲ್ಲಿ ಸ್ಪಷ್ಟ ಹೊಂದಾಣಿಕೆ ಕಂಡುಬಂದಿಲ್ಲ.", "ಈ ಪುಟದಲ್ಲಿ ಕಾಣುವ ಫಾರ್ಮ್ ಕ್ಷೇತ್ರಗಳು ಕಂಡುಬಂದಿಲ್ಲ.", "ಈ ಪುಟದಲ್ಲಿ ಕಾಣುವ ಲಿಂಕ್‌ಗಳು ಅಥವಾ ಬಟನ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ.", "ಈ ಪುಟದಲ್ಲಿ ಹುಡುಕಿ", "ನೀವು ಏನು ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?", "ಹುಡುಕಲು ಏನನ್ನಾದರೂ ನಮೂದಿಸಿ.", "ಫಾರ್ಮ್ ಕ್ಷೇತ್ರಗಳನ್ನು ಫಿಲ್ಟರ್ ಮಾಡಿ...", "ಎಂಬೆಡ್ ಮಾಡಿದ ಪುಟಗಳು ಮತ್ತು ವಿಭಾಗಗಳಲ್ಲಿ ಹುಡುಕುತ್ತಿದೆ..."], "or": ["ଭାଷା", "ଆପଣ କଣ କରିବାକୁ ଚାହୁଁଛନ୍ତି?", "ଏକ କାମ ବାଛନ୍ତୁ। ClickSimple ଏହି ପୃଷ୍ଠାରେ ପଦକ୍ଷେପ ଅନୁସାରେ ଆପଣଙ୍କୁ ମାର୍ଗଦର୍ଶନ କରିବ।", "ଫର୍ମ ପୂରଣ କରନ୍ତୁ", "ଫର୍ମ ଫିଲ୍ଡ ଯାଞ୍ଚ କରନ୍ତୁ, ଇନପୁଟ୍ ଖୋଜନ୍ତୁ ଏବଂ ଆବଶ୍ୟକ ବିବରଣୀ ବୁଝନ୍ତୁ।", "କିଛି ଖୋଜନ୍ତୁ", "ଏହି ପୃଷ୍ଠାରେ ଖୋଜନ୍ତୁ ଏବଂ ଆବଶ୍ୟକ ହେଲେ ଅନ୍ୟ ପୃଷ୍ଠାକୁ ଯିବା ପାଇଁ ମାର୍ଗଦର୍ଶନ ପାଆନ୍ତୁ।", "ଏହି ୱେବସାଇଟ୍‌ରେ ନାଭିଗେଟ୍ କରନ୍ତୁ", "ଉପଯୋଗୀ ଲିଙ୍କ୍, ବଟନ୍ ଏବଂ ମୁଖ୍ୟ ବିଭାଗ ଖୋଜନ୍ତୁ।", "ମୋ କାମ ବର୍ଣ୍ଣନା କରନ୍ତୁ", "ଆପଣ କଣ କରିବାକୁ ଚେଷ୍ଟା କରୁଛନ୍ତି ତାହା କୁହନ୍ତୁ।", "ଆପଣ କଣ ଖୋଜୁଛନ୍ତି?", "ଖୋଜନ୍ତୁ", "କାମକୁ ଫେରନ୍ତୁ", "ପରବର୍ତ୍ତୀ ଫଳାଫଳ →", "ସମାପ୍ତ", "ଫଳାଫଳ", "ଏହା ମୋତେ କାହିଁକି ଦେଖାଯାଉଛି?", "ଏହି ଆଇଟମ୍‌ର ଲେବଲ୍ କିମ୍ବା ପାଖରେ ଥିବା ଲେଖା ଆପଣଙ୍କ ଲକ୍ଷ୍ୟ ସହ ଜଡିତ ହୋଇପାରେ। କାର୍ଯ୍ୟ କରିବା ପୂର୍ବରୁ ମାର୍ଗଦର୍ଶନ ଦେଖନ୍ତୁ।", "ହାଇଲାଇଟ୍ ହୋଇଥିବା ଆଇଟମ୍‌ଟି ଯାଞ୍ଚ କରନ୍ତୁ। ପ୍ରତ୍ୟେକ କ୍ଲିକ୍‌ର ନିୟନ୍ତ୍ରଣ ଆପଣଙ୍କ ପାଖରେ ରହିବ।", "ଏହି ପୃଷ୍ଠା କିମ୍ବା ଏଥିରେ ଥିବା ଫ୍ରେମ୍‌ଗୁଡ଼ିକରେ ସ୍ପଷ୍ଟ ମେଳ ମିଳିଲା ନାହିଁ।", "ଏହି ପୃଷ୍ଠାରେ ଦେଖାଯାଉଥିବା ଫର୍ମ ଫିଲ୍ଡ ମିଳିଲା ନାହିଁ।", "ଏହି ପୃଷ୍ଠାରେ ଦେଖାଯାଉଥିବା ଲିଙ୍କ୍ କିମ୍ବା ବଟନ୍ ମିଳିଲା ନାହିଁ।", "ଏହି ପୃଷ୍ଠାରେ ଖୋଜନ୍ତୁ", "ଆପଣ କଣ କରିବାକୁ ଚାହୁଁଛନ୍ତି?", "ଖୋଜିବା ପାଇଁ କିଛି ଲେଖନ୍ତୁ।", "ଫର୍ମ ଫିଲ୍ଡ ଫିଲ୍ଟର୍ କରନ୍ତୁ...", "ଏମ୍ବେଡ୍ ହୋଇଥିବା ପୃଷ୍ଠା ଏବଂ ବିଭାଗରେ ଖୋଜୁଛି..."], "ml": ["ഭാഷ", "നിങ്ങൾ എന്താണ് ചെയ്യാൻ ആഗ്രഹിക്കുന്നത്?", "ഒരു ജോലി തിരഞ്ഞെടുക്കൂ. ഈ പേജിൽ ClickSimple ഘട്ടംഘട്ടമായി നിങ്ങളെ നയിക്കും.", "ഫോം പൂരിപ്പിക്കുക", "ഫോം ഫീൽഡുകൾ പരിശോധിക്കുക, ഇൻപുട്ടുകൾ കണ്ടെത്തുക, ആവശ്യമായ വിവരങ്ങൾ മനസ്സിലാക്കുക.", "എന്തെങ്കിലും കണ്ടെത്തുക", "ഈ പേജിൽ തിരയുക; ആവശ്യമെങ്കിൽ മറ്റു പേജുകളിലേക്ക് പോകാൻ മാർഗനിർദേശം നേടുക.", "ഈ വെബ്‌സൈറ്റിൽ നാവിഗേറ്റ് ചെയ്യുക", "ഉപയോഗപ്രദമായ ലിങ്കുകൾ, ബട്ടണുകൾ, പ്രധാന വിഭാഗങ്ങൾ എന്നിവ കണ്ടെത്തുക.", "എന്റെ ജോലി വിവരിക്കുക", "നിങ്ങൾ എന്താണ് ചെയ്യാൻ ശ്രമിക്കുന്നതെന്ന് പറയുക.", "നിങ്ങൾ എന്താണ് തിരയുന്നത്?", "തിരയുക", "ജോലികളിലേക്ക് മടങ്ങുക", "അടുത്ത ഫലം →", "പൂർത്തിയാക്കുക", "ഫലം", "ഇത് എനിക്ക് എന്തുകൊണ്ട് കാണിക്കുന്നു?", "ഈ ഘടകത്തിന്റെ ലേബലോ സമീപമുള്ള വാചകമോ നിങ്ങളുടെ ലക്ഷ്യവുമായി ബന്ധപ്പെട്ടിരിക്കാം. പ്രവർത്തിക്കുന്നതിന് മുമ്പ് മാർഗനിർദേശം പരിശോധിക്കുക.", "ഹൈലൈറ്റ് ചെയ്ത ഘടകം പരിശോധിക്കുക. ഓരോ ക്ലിക്കിന്റെയും നിയന്ത്രണം നിങ്ങളുടേതാണ്.", "ഈ പേജിലോ ഉൾച്ചേർത്ത ഫ്രെയിമുകളിലോ വ്യക്തമായ പൊരുത്തം കണ്ടെത്താനായില്ല.", "ഈ പേജിൽ കാണാവുന്ന ഫോം ഫീൽഡുകൾ കണ്ടെത്താനായില്ല.", "ഈ പേജിൽ കാണാവുന്ന ലിങ്കുകളോ ബട്ടണുകളോ കണ്ടെത്താനായില്ല.", "ഈ പേജിൽ തിരയുക", "നിങ്ങൾ എന്താണ് ചെയ്യാൻ ആഗ്രഹിക്കുന്നത്?", "തിരയാൻ എന്തെങ്കിലും നൽകുക.", "ഫോം ഫീൽഡുകൾ ഫിൽട്ടർ ചെയ്യുക...", "ഉൾച്ചേർത്ത പേജുകളിലും വിഭാഗങ്ങളിലും തിരയുന്നു..."]};

const LANGS=[
  ["en","English"],
  ["hi","हिन्दी · Hindi"],
  ["bn","বাংলা · Bengali"],
  ["mr","मराठी · Marathi"],
  ["te","తెలుగు · Telugu"],
  ["ta","தமிழ் · Tamil"],
  ["gu","ગુજરાતી · Gujarati"],
  ["ur","اردو · Urdu"],
  ["kn","ಕನ್ನಡ · Kannada"],
  ["or","ଓଡ଼ିଆ · Odia"],
  ["ml","മലയാളം · Malayalam"],
  ["zh","中文 · Chinese"],
  ["es","Español · Spanish"],
  ["ar","العربية · Arabic"],
  ["fr","Français · French"],
  ["pt","Português · Portuguese"],
  ["ru","Русский · Russian"]
];
const GOAL_PLACEHOLDERS={en:"Describe what you want to do...",hi:"बताएँ कि आप क्या करना चाहते हैं...",bn:"আপনি কী করতে চান তা লিখুন...",mr:"तुम्हाला काय करायचे आहे ते सांगा...",te:"మీరు ఏమి చేయాలనుకుంటున్నారో వివరించండి...",ta:"நீங்கள் என்ன செய்ய விரும்புகிறீர்கள் என்பதை விவரிக்கவும்...",gu:"તમે શું કરવા માંગો છો તે જણાવો...",ur:"بتائیں کہ آپ کیا کرنا چاہتے ہیں...",kn:"ನೀವು ಏನು ಮಾಡಲು ಬಯಸುತ್ತೀರಿ ಎಂದು ತಿಳಿಸಿ...",or:"ଆପଣ କଣ କରିବାକୁ ଚାହୁଁଛନ୍ତି ତାହା କୁହନ୍ତୁ...",ml:"നിങ്ങൾ എന്താണ് ചെയ്യാൻ ആഗ്രഹിക്കുന്നതെന്ന് വിവരിക്കുക...",zh:"描述你想完成的任务...",es:"Describe lo que quieres hacer...",ar:"صِف ما تريد القيام به...",fr:"Décrivez ce que vous souhaitez faire...",pt:"Descreva o que você deseja fazer...",ru:"Опишите, что вы хотите сделать..."};
let lang="en",steps=[],idx=0,marked=null,markedRemote=null,journey=null,lastJourneyUrl=location.href,journeyRefreshTimer=null,journeyUrlTimer=null;
const t=k=>DATA[lang][KEYS.indexOf(k)]||DATA.en[KEYS.indexOf(k)]||k;

sh.innerHTML=`<style>
*{box-sizing:border-box}.cs-panel{font:14px Inter,ui-sans-serif,system-ui,-apple-system,sans-serif;width:360px;max-height:calc(100vh - 36px);overflow:auto;background:#17171b;color:#f4f2ed;border:1px solid #38383f;border-radius:20px;box-shadow:0 18px 60px #0008;padding:16px}.cs-hidden{display:none!important}.head{display:flex;align-items:center;gap:10px;padding-bottom:12px;border-bottom:1px solid #34343a}.logo{width:38px;height:38px;border-radius:12px;background:#b9f36b;color:#17171b;display:grid;place-items:center;font-size:23px;flex:none}.brand{font-size:16px;font-weight:850;letter-spacing:-.5px;flex:1}.brand span{color:#b9f36b}.tagline{display:block;color:#85858e;font-size:8px;letter-spacing:1px;margin-top:2px;font-weight:750}.close{border:1px solid #414149;background:#25252b;color:#e8e6e1;border-radius:9px;padding:7px 10px;cursor:pointer}.sub{font-size:11px;color:#a3a2aa;margin:12px 0 14px;line-height:1.5}.label{font-size:9px;color:#b9f36b;font-weight:850;letter-spacing:1.3px}.select,.input{width:100%;padding:11px 12px;border:1px solid #414149;border-radius:10px;font-size:13px;background:#232329;color:#f4f2ed;margin:7px 0 14px;outline:none}.select:focus,.input:focus{border-color:#b9f36b;box-shadow:0 0 0 3px #b9f36b20}.question{font-size:19px;font-weight:850;letter-spacing:-.6px;margin:10px 0 6px}.copy{font-size:12px;line-height:1.55;color:#aaa9b0;margin:0 0 13px}.option{width:100%;display:block;text-align:left;padding:12px 13px;margin:8px 0;border:1px solid #38383f;border-radius:12px;background:#222227;color:#f4f2ed;cursor:pointer;transition:.15s}.option:hover{border-color:#b9f36b;background:#292d23;transform:translateY(-1px)}.option b{display:block;font-size:13px}.option small{display:block;color:#96959e;font-size:11px;margin-top:4px;line-height:1.4}.primary{background:#b9f36b;color:#17171b;border:0;border-radius:10px;padding:11px 14px;font-weight:850;cursor:pointer}.secondary{background:#29292f;color:#e9e7e2;border:1px solid #414149;border-radius:10px;padding:11px 14px;cursor:pointer}.row{display:flex;gap:8px;margin-top:13px}.row button{flex:1}.step{font-size:10px;color:#b9f36b;font-weight:850;letter-spacing:1px;margin:16px 0 8px}.instruction{font-size:14px;line-height:1.6;margin:0 0 10px;color:#f1efe9}.reason{font-size:11px;color:#c0bfc5;background:#24242a;border:1px solid #38383f;padding:11px;border-radius:10px;line-height:1.5;margin:12px 0}.reason b{color:#b9f36b}.progress{height:6px;background:#36363d;border-radius:9px;overflow:hidden;margin-top:14px}.progress span{display:block;height:100%;background:#b9f36b;border-radius:9px}.note{font-size:10px;color:#85858e;line-height:1.5;margin-top:13px}.route-card{background:#222227;border:1px solid #38383f;border-radius:12px;padding:11px;margin:9px 0}.route-card>b{display:block;font-size:13px;color:#f4f2ed}.route-card p{font-size:12px;line-height:1.5;color:#d0cfd4;margin:6px 0}.route-card small{display:block;color:#96959e;font-size:10px;line-height:1.45}.route-highlight{margin-top:9px;background:#292d23;color:#b9f36b;border:1px solid #596b3c;border-radius:8px;padding:7px 9px;font-size:11px;font-weight:750;cursor:pointer}.cs-target{outline:3px solid #b9f36b!important;outline-offset:4px!important;scroll-margin:110px!important;box-shadow:0 0 0 7px #b9f36b25!important}.cs-panel[dir=rtl]{direction:rtl;text-align:right}
@media(max-width:420px){.cs-panel{width:min(360px,calc(100vw - 24px));max-height:calc(100vh - 24px)}}
</style><section class="cs-panel" role="dialog" aria-label="ClickSimple assistant"><div class="head"><div class="logo" aria-hidden="true">🐈‍⬛</div><div class="brand">Click<span>Simple</span><small class="tagline">LET EVIL LARRY HELP YOU</small></div><button class="close" aria-label="Close">✕</button></div><p class="sub">Pick a task and Larry will show you where to go.</p><div class="body"></div></section>`;

const panel=sh.querySelector(".cs-panel"),body=sh.querySelector(".body");
sh.querySelector(".close").onclick=()=>{clear();panel.classList.add("cs-hidden")};

const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>(s||"").toLocaleLowerCase().normalize("NFKC").replace(/[’‘]/g,"'").replace(/[^\p{L}\p{N}]+/gu," ").replace(/\s+/g," ").trim();

function visible(e){
  if(!e||!e.isConnected)return false;
  const r=e.getBoundingClientRect(),view=e.ownerDocument?.defaultView||window,s=view.getComputedStyle(e);
  return r.width>0&&r.height>0&&s.display!=="none"&&s.visibility!=="hidden"&&Number(s.opacity)!==0;
}

// ISSUE 1 RESOLVED: Clean text & deduplication of words (eliminating repeated words like "home home")
function deduplicateWords(str){
  if(!str) return "";
  const words = str.trim().split(/\s+/);
  const result = [];
  for(let i=0; i<words.length; i++){
    if(i === 0 || words[i].toLowerCase() !== words[i-1].toLowerCase()){
      result.push(words[i]);
    }
  }
  return result.join(" ");
}

function label(e){
  if(!e)return "";
  const aria=e.getAttribute("aria-label");
  const labelledBy=(e.getAttribute("aria-labelledby")||"").split(/\s+/).filter(Boolean)
    .map(id=>e.ownerDocument?.getElementById(id)?.textContent||"").join(" ");
  const associated=e.labels?[...e.labels].map(x=>x.textContent||"").join(" "):"";
  const wrapped=e.closest("label")?.textContent||"";
  const placeholder=e.getAttribute("placeholder");
  const title=e.getAttribute("title");
  const alt=e.getAttribute("alt");
  const txt=(e.innerText||e.textContent||"").trim();
  const raw=aria||labelledBy||associated||wrapped||title||placeholder||alt||
    (txt.length<120?txt:txt.slice(0,90))||e.getAttribute("name")||e.id||"";
  return deduplicateWords(raw.replace(/\s+/g," ").trim());
}

// ISSUE 2 RESOLVED: Deep DOM inspection including embedded iframes & shadow DOMs
function collect(sel, doc=document){
  const elements=[];
  const visitedRoots=new Set();
  const scanRoot=root=>{
    if(!root||visitedRoots.has(root))return;
    visitedRoots.add(root);
    try{
      elements.push(...[...root.querySelectorAll(sel)].filter(e=>{
        if(e.id==="clicksimple-host"||e.closest?.("#clicksimple-host"))return false;
        return visible(e);
      }));
      for(const node of root.querySelectorAll("*")){
        if(node.id==="clicksimple-host")continue;
        if(node.shadowRoot)scanRoot(node.shadowRoot);
      }
      if(root.nodeType===9){
        for(const frame of root.querySelectorAll("iframe,frame")){
          try{
            const childDoc=frame.contentDocument||frame.contentWindow?.document;
            if(childDoc)scanRoot(childDoc);
          }catch(_){/* Cross-origin frames are handled through the opt-in frame scanner. */}
        }
      }
    }catch(_){}
  };
  scanRoot(doc);
  return elements;
}

function clear(){
  if(marked&&marked.ownerDocument?.contains(marked))marked.classList.remove("cs-target");
  marked=null;
  if(markedRemote){
    runtimeMessage({type:"CLICKSIMPLE_CLEAR_EMBEDDED_HIGHLIGHT",frameId:markedRemote.frameId});
    markedRemote=null;
  }
}

function jump(e){
  clear();
  if(!e||!e.isConnected)return;
  marked=e;
  e.classList.add("cs-target");
  requestAnimationFrame(()=>{
    if(!e.isConnected)return;
    try{e.scrollIntoView({behavior:"smooth",block:"center",inline:"nearest"});}
    catch(_){e.scrollIntoView();}
    try{e.focus({preventScroll:true});}catch(_){}
  });
}

function expandQuery(q){
  const normalized = norm(q);
  const words = normalized.split(" ").filter(Boolean);
  const expanded = new Set(words);
  for(const w of words){
    for(const [key, syns] of Object.entries(SYNONYMS)){
      if(w.includes(key) || key.includes(w) || syns.some(s => w.includes(s) || s.includes(w))){
        expanded.add(key);
        syns.forEach(s => expanded.add(s));
      }
    }
  }
  return { query: normalized, rawWords: words, words: Array.from(expanded) };
}

function runtimeMessage(message){
  return new Promise(resolve=>{
    try{chrome.runtime.sendMessage(message,response=>resolve(response||null));}
    catch(_){resolve(null)}
  });
}

async function embeddedSteps(mode,query=""){
  const response=await runtimeMessage({type:"CLICKSIMPLE_SCAN_EMBEDDED",mode,query,topOrigin:location.origin});
  return response?.results||[];
}

function combineSteps(local,remote,limit=5){
  const all=[...(local||[]),...(remote||[])];
  const seen=new Set();
  return all.sort((a,b)=>(b.score||0)-(a.score||0)).filter(item=>{
    const key=`${norm(item.title)}:${item.kind||""}`;
    if(seen.has(key))return false;
    seen.add(key);return true;
  }).slice(0,limit);
}

async function jumpRemote(item){
  clear();
  markedRemote=item;
  const frame=[...document.querySelectorAll("iframe,frame")].find(candidate=>{
    try{
      const u=new URL(candidate.getAttribute("src")||"about:blank",location.href);
      return u.href===item.frameUrl || (u.origin===new URL(item.frameUrl).origin && u.pathname===new URL(item.frameUrl).pathname);
    }catch(_){return false;}
  });
  if(frame){
    try{frame.scrollIntoView({behavior:"smooth",block:"center",inline:"nearest"});}catch(_){frame.scrollIntoView();}
  }
  const result=await runtimeMessage({type:"CLICKSIMPLE_HIGHLIGHT_EMBEDDED",frameId:item.frameId,path:item.path});
  if(!result?.ok)body.querySelector?.(".note")?.replaceChildren(document.createTextNode("The embedded section changed or is no longer available. Try scanning the page again."));
}

function nearbyContext(e){
  if(!e)return {heading:"",region:"",text:""};
  const region=e.closest('nav,main,form,fieldset,section,article,li,[role="navigation"],[role="region"]')||e.parentElement;
  let heading="";
  if(region){
    const h=[...region.querySelectorAll('h1,h2,h3,h4,h5,h6,legend,[role="heading"]')].find(x=>x!==e&& !x.contains(e));
    if(h)heading=deduplicateWords((h.innerText||h.textContent||"").trim()).slice(0,100);
  }
  const labelledBy=region?.getAttribute?.("aria-labelledby");
  const labelledElement=labelledBy?region.ownerDocument?.getElementById(labelledBy):null;
  const regionName=region?.getAttribute?.("aria-label")||(labelledElement?(labelledElement.innerText||labelledElement.textContent||"").trim():"")||region?.tagName?.toLowerCase()||"";
  const text=region?deduplicateWords((region.innerText||region.textContent||"").replace(/\s+/g," ").trim()).slice(0,240):"";
  return {heading,region:regionName,text};
}

function commonSitePurpose(name,href=""){
  const text=norm(`${name} ${href}`);
  const patterns=[
    [/\b(account|profile|my details|personal details)\b/,"Usually shows your personal details, profile, or security options."],
    [/\b(dashboard|home|overview)\b/,"Usually gives an overview and shortcuts to the main tasks."],
    [/\b(order|orders|purchase|purchase history)\b/,"Usually lists purchases, their status, receipts, or returns."],
    [/\b(track order|tracking|shipment|delivery status)\b/,"Usually shows where a delivery is and its latest status."],
    [/\b(cart|basket)\b/,"Usually holds the items you have selected before checkout."],
    [/\b(checkout)\b/,"Usually lets you review an order and choose delivery and payment details."],
    [/\b(return|refund|replacement)\b/,"Usually explains how to return an item or request money back."],
    [/\b(payment|payments|billing|invoice|invoices|subscription|fee|fees)\b/,"Usually shows payment methods, charges, dues, or invoices."],
    [/\b(help|support|faq|frequently asked)\b/,"Usually contains answers to common questions and ways to get help."],
    [/\b(setting|settings|preference|preferences)\b/,"Usually lets you change account or website preferences."],
    [/\b(notification|notifications|message|messages|inbox)\b/,"Usually shows updates, alerts, or messages."],
    [/\b(document|documents|file|files|record|records|download)\b/,"Usually provides records or files you can view or download."],
    [/\b(search|find|lookup)\b/,"Usually helps you find a page, record, or item."],
    [/\b(sign in|signin|login|log in)\b/,"Usually opens the form for an existing account."],
    [/\b(sign up|signup|register|registration|create account)\b/,"Usually starts the process of creating an account."],
    [/\b(log out|logout|sign out|signout)\b/,"Usually signs you out of the website."],
    [/\b(contact|contact us)\b/,"Usually shows how to reach the organization."],
    [/\b(about|about us)\b/,"Usually explains who runs the website and what the organization does."],
    [/\b(service|services)\b/,"Usually lists the services the organization provides."],
    [/\b(product|products|catalog|shop)\b/,"Usually shows the products or items available."],
    [/\b(course|courses|subject|subjects|class|classes)\b/,"Usually lists classes, subjects, or learning materials."],
    [/\b(admission|admissions|application|apply now)\b/,"Usually explains how to apply or check an application."],
    [/\b(result|results|grade|grades|marks|score|scores)\b/,"Usually shows exam results, marks, or progress."],
    [/\b(timetable|schedule|calendar|appointment)\b/,"Usually shows dates, times, classes, or planned events."],
    [/\b(attendance)\b/,"Usually shows attendance records or attendance-related actions."],
    [/\b(privacy|terms|policy)\b/,"Usually explains the website's privacy rules or terms of use."]
  ];
  return patterns.find(([re])=>re.test(text))?.[1]||"";
}

function describeControl(e){
  const name=label(e)||e.tagName.toLowerCase();
  const tag=e.tagName.toLowerCase();
  const ctx=nearbyContext(e);
  const context=ctx.heading?` It is in the “${ctx.heading}” section.`:ctx.region?` It is in the page's ${ctx.region} area.`:"";
  if(tag==="a"){
    const href=e.getAttribute("href")||"";
    if(!href||href.startsWith("javascript:"))return {detail:`“${name}” is a link, but this page does not show where it leads.${context}`,reason:"The destination is not available to inspect. Check the nearby page text before opening it."};
    try{
      const base=e.ownerDocument?.location?.href||location.href;
      const u=new URL(href,base);
      let destination;
      if(u.protocol==="mailto:")destination=`your email app to write to ${u.pathname}`;
      else if(u.protocol==="tel:")destination=`a phone link for ${u.pathname}`;
      const samePageHash=!!u.hash&&u.pathname===(e.ownerDocument?.location?.pathname||location.pathname);
      if(samePageHash)destination=`the “${u.hash.slice(1)}” section on this page`;
      else if(u.protocol!=="mailto:"&&u.protocol!=="tel:")destination=`${u.hostname===(e.ownerDocument?.location?.hostname||location.hostname)?"this website":"the external website "+u.hostname}${u.pathname==="/"?"":u.pathname}`;
      if(e.hasAttribute("download"))destination+=` (download: ${e.getAttribute("download")||u.pathname.split("/").pop()||"file"})`;
      const purpose=commonSitePurpose(name,href);
      const newTab=e.target==="_blank"?" It opens in a new tab.":"";
      return {detail:`“${name}” ${samePageHash?"links to":"takes you to"} ${destination}.${purpose?` ${purpose}`:""}${newTab}${context}`,reason:purpose?"The short guide describes what this type of website section is commonly used for; the destination is read from the link itself.":"This is a navigation link. Its destination is read from the link itself."};
    }catch(_){return {detail:`“${name}” is a navigation link, but its destination could not be read.${context}`,reason:"The page exposes this item as a link but not a readable destination."};}
  }
  if(tag==="summary")return {detail:`“${name}” shows or hides the details underneath it.${context}`,reason:"This is a built-in expand/collapse control."};
  const type=(e.getAttribute("type")||"").toLowerCase();
  const expanded=e.getAttribute("aria-expanded");
  const popup=e.getAttribute("aria-haspopup");
  const controls=e.getAttribute("aria-controls");
  if(expanded!==null){
    const controlled=controls?e.ownerDocument?.getElementById(controls):null;
    const controlledName=controlled?(label(controlled)||controlled.id):"the related page content";
    return {detail:`“${name}” shows or hides ${controlledName}. It is currently ${expanded==="true"?"open":"closed"}.${context}`,reason:"The page identifies this as an expand/collapse control."};
  }
  if(popup&&popup!=="false")return {detail:`“${name}” opens a ${popup==="true"?"popup":popup}.${context}`,reason:"The page identifies this as a popup control."};
  if(type==="submit"||(tag==="button"&&e.form&&type!=="button"&&type!=="reset")){
    const form=e.form;
    const formName=form?(form.getAttribute("aria-label")||form.querySelector("legend")?.textContent||form.querySelector("h1,h2,h3")?.textContent||""):"";
    return {detail:`“${name}” submits${formName?` the “${deduplicateWords(formName.trim())}” form`:" its form"}. Check the fields before using it.${context}`,reason:"The page marks this control as a form submit button."};
  }
  if(type==="reset")return {detail:`“${name}” resets this form's fields to their original values.${context}`,reason:"The button is marked as a reset control."};
  const common=commonSitePurpose(name);
  if(common)return {detail:`“${name}” is an on-page action. ${common}${context}`,reason:"This is a built-in guide to a common website option. The exact action can vary by website."};
  const n=norm(name);
  const known=[
    [/\b(search|find|lookup)\b/,"Usually starts a search for a page, record, or item."],
    [/\b(save|update)\b/,"Usually saves changes to the information in this section."],
    [/\b(submit|send|apply|continue|next)\b/,"Usually moves the current form or process forward."],
    [/\b(back|previous|return)\b/,"Usually returns to an earlier page or step."],
    [/\b(cancel|close)\b/,"Usually closes or cancels the current action."],
    [/\b(download|export)\b/,"Usually downloads or exports information."],
    [/\b(print)\b/,"Usually opens the print view."],
    [/\b(delete|remove)\b/,"Usually removes the selected item; check what is selected first."]
  ].find(([re])=>re.test(n));
  const inferred=known?known[1]:"The page does not explain this button's exact effect. Check the nearby text before using it.";
  return {detail:`“${name}” is an on-page action. ${inferred}${context}`,reason:ctx.heading?`It appears in the “${ctx.heading}” section.` :"The description is limited to what the page makes visible."};
}

function describeMatch(e,raw,q="",mode="find"){
  const tag=e.tagName.toLowerCase();
  if(["a","button","summary"].includes(tag)||e.getAttribute("role")==="button"||e.getAttribute("role")==="link")return describeControl(e).detail;
  if(["input","textarea","select"].includes(tag)){
    const name=fieldName(e,0);
    return `${name}: ${fieldDescription(e,name)}`;
  }
  const ctx=nearbyContext(e);
  const topic=q?`“${q}”`:"your task";
  if(["h1","h2","h3","h4","h5","h6"].includes(tag))return `Section: “${label(e)||"Untitled"}”. Check the information just below it.`;
  if(ctx.heading)return `Under “${ctx.heading}”: this area may help with ${topic}.`;
  if(mode==="custom")return `This area may help with your task. Check the nearby details.`;
  return `This area contains related information. Check the nearby details for ${topic}.`;
}

function findMatches(q,mode="find"){
  const {query,rawWords,words}=expandQuery(q);
  if(!query)return [];
  const selector='a[href],button,input:not([type="hidden"]),textarea,select,[role="button"],[role="link"],h1,h2,h3,h4,h5,h6,p,li,label,summary,section,article,div,span';
  const candidates=collect(selector),found=[],seen=new Set();
  for(const e of candidates){
    const parentAction=e.closest('a[href],button,[role="button"],[role="link"]');
    if(parentAction&&parentAction!==e)continue;
    const raw=(e.innerText||e.textContent||label(e)||"").replace(/\s+/g," ").trim();
    if(!raw||raw.length>8000)continue;
    const ctx=nearbyContext(e);
    const href=e.getAttribute("href")||"";
    const searchable=norm([label(e),raw.slice(0,500),href,ctx.heading].join(" "));
    if(!searchable)continue;
    const exactWordHits=rawWords.filter(w=>searchable.split(" ").includes(w)).length;
    const synonymHits=words.filter(w=>(` ${searchable} `).includes(` ${w} `)).length;
    if(exactWordHits===0&&synonymHits===0)continue;
    if(rawWords.length>1&&exactWordHits===0&&synonymHits<2)continue;
    const key=e.tagName+":"+norm(label(e)||raw).slice(0,100);
    if(seen.has(key))continue;
    seen.add(key);
    let score=exactWordHits*30+synonymHits*4;
    if(searchable.includes(query))score+=45;
    const tag=e.tagName.toLowerCase();
    if(["a","button","label","input","textarea","select","h1","h2","h3"].includes(tag))score+=20;
    if(raw.length<140)score+=8;
    if(ctx.heading&&norm(ctx.heading).split(" ").some(w=>rawWords.includes(w)))score+=12;
    found.push({el:e,title:deduplicateWords((label(e)||raw).slice(0,75)),detail:describeMatch(e,raw,q,mode),score,reason:mode==="custom"?"This section or item may help with the task you described.":"The search words appear in this item's label, text, link, or nearby section."});
  }
  found.sort((a,b)=>b.score-a.score);
  return found.slice(0,5).map(m=>({el:m.el,title:m.title||"Matched item",detail:m.detail,score:m.score,reason:m.reason}));
}

function routeCandidates(q){
  const {query,rawWords,words}=expandQuery(q);
  const items=collect('a[href],button,[role="button"],[role="link"],summary').filter(e=>!e.disabled&&label(e).length>1);
  const ranked=[];const seen=new Set();
  for(const e of items){
    const ctx=nearbyContext(e);const href=e.getAttribute("href")||"";
    const search=norm([label(e),href,ctx.heading,ctx.region].join(" "));
    const exact=rawWords.filter(w=>search.split(" ").includes(w)).length;
    const syn=words.filter(w=>(` ${search} `).includes(` ${w} `)).length;
    const inNav=!!e.closest('nav,[role="navigation"]');
    const hasGoalTerms=exact>0||syn>0;
    let score=exact*35+syn*5+(inNav?12:0)+(e.tagName.toLowerCase()==="a"?6:0);
    if((` ${search} `).includes(` ${query} `))score+=35;
    const key=(href||e.tagName+":"+norm(label(e))).split("#")[0];
    if(seen.has(key))continue;seen.add(key);
    const described=describeControl(e);
    ranked.push({el:e,title:label(e).slice(0,75),detail:described.detail,reason:hasGoalTerms?"The link label, destination, or nearby section contains words related to your goal.":"No direct match is visible here. This is one of the page's available navigation choices; use the section name to decide whether it is a sensible next step.",score,inNav,hasGoalTerms});
  }
  ranked.sort((a,b)=>b.score-a.score);
  const direct=ranked.filter(x=>x.hasGoalTerms).slice(0,5);
  if(direct.length)return direct;
  return ranked.filter(x=>x.inNav||x.el.tagName.toLowerCase()==="a").slice(0,5);
}

async function saveJourney(){
  if(!journey)return;
  await runtimeMessage({type:"CLICKSIMPLE_SAVE_JOURNEY",journey});
}
async function stopJourney(){
  await runtimeMessage({type:"CLICKSIMPLE_CLEAR_JOURNEY"});
  journey=null;clearTimeout(journeyRefreshTimer);journeyRefreshTimer=null;
  if(journeyUrlTimer){clearInterval(journeyUrlTimer);journeyUrlTimer=null;}
  clear();home();
}

function startJourneyMonitor(){
  if(journeyUrlTimer)return;
  journeyUrlTimer=setInterval(()=>{
    if(location.href!==lastJourneyUrl){
      lastJourneyUrl=location.href;
      if(journey){
        clearTimeout(journeyRefreshTimer);
        journeyRefreshTimer=setTimeout(()=>refreshJourneyPage(),700);
      }
    }
  },700);
}

function showJourneyGuide(candidates){
  const pages=journey?.visited?.length||1;
  const cards=candidates.map((item,i)=>`<article class="route-card"><b>${esc(item.title)}</b><p>${esc(item.detail)}</p><small>${esc(item.reason)}</small><button class="route-highlight" data-route="${i}">Highlight this option</button></article>`).join("");
  body.innerHTML=`<div class="step">GUIDED SEARCH · PAGE ${pages}</div><div class="question">Not on this page yet</div><p class="copy">Still looking for <b>“${esc(journey.query)}”</b>. Follow a likely section below. Larry will check the next page and keep your search active.</p>${cards||`<p class="copy">No clear navigation links are visible. Open the website's menu or choose a section that seems related, then Larry can check that page.</p>`}<div class="reason"><b>How this works</b><br>Nothing is clicked automatically. Choose a highlighted link on the website; the search continues when the next page loads.</div><div class="row"><button class="secondary" id="journey-home">Back to tasks</button><button class="primary" id="stop-journey">Stop search</button></div>`;
  body.querySelectorAll("[data-route]").forEach(b=>b.onclick=()=>{const item=candidates[Number(b.dataset.route)];if(item?.el)jump(item.el);else if(item?.remote)jumpRemote(item)});
  body.querySelector("#journey-home").onclick=home;
  body.querySelector("#stop-journey").onclick=stopJourney;
}

function showJourneyMatches(matches){
  const cards=matches.map((item,i)=>`<article class="route-card"><b>${esc(item.title)}</b><p>${esc(item.detail)}</p><small>${esc(item.reason)}</small><button class="route-highlight" data-match="${i}">Highlight this result</button></article>`).join("");
  body.innerHTML=`<div class="step">GUIDED SEARCH · PAGE ${journey.visited.length}</div><div class="question">Possible match found</div><p class="copy">Larry found something related to <b>“${esc(journey.query)}”</b> on this page. Check the description before using it.</p>${cards}<div class="row"><button class="secondary" id="journey-home">Back to tasks</button><button class="primary" id="stop-journey">Finish search</button></div>`;
  body.querySelectorAll("[data-match]").forEach(b=>b.onclick=()=>{const item=matches[Number(b.dataset.match)];if(item?.el)jump(item.el);else if(item?.remote)jumpRemote(item)});
  body.querySelector("#journey-home").onclick=home;
  body.querySelector("#stop-journey").onclick=stopJourney;
  if(matches[0]?.el)jump(matches[0].el);else if(matches[0]?.remote)jumpRemote(matches[0]);
}

async function refreshJourneyPage(){
  if(!journey)return;
  const url=location.href;
  if(journey.visited[journey.visited.length-1]!==url){
    if(!journey.visited.includes(url))journey.visited.push(url);
    journey.visited=journey.visited.slice(-30);
    await saveJourney();
  }
  const local=findMatches(journey.query);
  const remote=await embeddedSteps("find",journey.query);
  const matches=combineSteps(local,remote,5);
  if(matches.length)showJourneyMatches(matches);
  else {
    const localRoutes=routeCandidates(journey.query);
    const remoteRoutes=await embeddedSteps("nav",journey.query);
    showJourneyGuide(combineSteps(localRoutes,remoteRoutes,8));
  }
}

async function restoreJourney(){
  const response=await runtimeMessage({type:"CLICKSIMPLE_GET_JOURNEY"});
  if(response?.journey?.query){journey=response.journey;startJourneyMonitor();await refreshJourneyPage();}
}

async function offerGuidedJourney(q){
  const local=routeCandidates(q);
  const remote=await embeddedSteps("nav",q);
  const candidates=combineSteps(local,remote,8);
  const cards=candidates.map((item,i)=>`<article class="route-card"><b>${esc(item.title)}</b><p>${esc(item.detail)}</p><small>${esc(item.reason)}</small><button class="route-highlight" data-route="${i}">Highlight this option</button></article>`).join("");
  body.innerHTML=`<div class="step">SEARCH THIS WEBSITE</div><div class="question">Nothing found on this page</div><p class="copy">“${esc(q)}” may be on another page or inside an embedded section. Larry can guide you through the options available here.</p>${cards}<div class="reason"><b>One limitation</b><br>Larry checks pages you open and embedded pages this extension has permission to inspect. Nothing is clicked automatically.</div><div class="row"><button class="secondary" id="try-again">Try another search</button><button class="primary" id="start-journey">Guide me there</button></div>`;
  body.querySelectorAll("[data-route]").forEach(b=>b.onclick=()=>{const item=candidates[Number(b.dataset.route)];if(item?.el)jump(item.el);else if(item?.remote)jumpRemote(item)});
  body.querySelector("#try-again").onclick=()=>begin("find");
  body.querySelector("#start-journey").onclick=async()=>{
    journey={query:q,startedAt:Date.now(),visited:[]};
    startJourneyMonitor();
    await saveJourney();
    await refreshJourneyPage();
  };
}

function fieldName(e,index=0){
  const names=[];
  if(e?.labels)names.push(...[...e.labels].map(x=>x.innerText||x.textContent||""));
  const labelledBy=(e?.getAttribute("aria-labelledby")||"").split(/\s+/).filter(Boolean)
    .map(id=>e.ownerDocument?.getElementById(id)?.innerText||e.ownerDocument?.getElementById(id)?.textContent||"");
  names.push(...labelledBy);
  names.push(e?.getAttribute("aria-label")||"");
  const wrapped=e?.closest("label");
  names.push(wrapped?.innerText||wrapped?.textContent||"");
  names.push(e?.getAttribute("title")||"",e?.getAttribute("placeholder")||"");
  names.push(e?.getAttribute("name")||"",e?.id||"");
  const candidate=deduplicateWords(names.find(x=>String(x||"").trim())||"")
    .replace(/([a-z])([A-Z])/g,"$1 $2").replace(/[_-]+/g," ").trim();
  if(candidate&&!/^(input|field|textfield|select|textarea|form control|element)(\s*\d+)?$|^(input|field|select|textarea|textbox|element)\d+$/i.test(candidate))return candidate;
  const type=(e?.getAttribute("type")||e?.tagName||"input").toLowerCase();
  const autocomplete=(e?.getAttribute("autocomplete")||"").toLowerCase();
  const known={email:"Email address",username:"Username","given-name":"First name","family-name":"Last name",name:"Name",tel:"Phone number",organization:"Organization","street-address":"Street address","postal-code":"Postal code","current-password":"Password","new-password":"New password",bday:"Date of birth"};
  if(known[autocomplete])return known[autocomplete];
  if(type==="email")return "Email address";
  if(type==="password")return "Password";
  if(type==="tel")return "Phone number";
  if(type==="date")return "Date";
  if(type==="number")return "Number";
  if(type==="checkbox")return "Confirmation";
  if(type==="radio")return "Choice";
  if(e?.tagName?.toLowerCase()==="select")return "Selection";
  if(e?.tagName?.toLowerCase()==="textarea")return "Additional details";
  return `Unlabelled field ${index+1}`;
}

function fieldDescription(e,name){
  const tag=e.tagName.toLowerCase();
  const type=(e.getAttribute("type")||tag).toLowerCase();
  const autocomplete=(e.getAttribute("autocomplete")||"").toLowerCase();
  let detail="Enter the requested information here.";
  if(tag==="select")detail="Choose the option that best matches your details.";
  else if(tag==="textarea")detail="Add the requested details here. This field accepts a longer response.";
  else if(type==="email"||autocomplete==="email")detail="Enter the email address requested by the form.";
  else if(type==="password"||autocomplete.includes("password"))detail="Enter the password requested by the form.";
  else if(type==="tel"||autocomplete==="tel")detail="Enter the phone number requested by the form.";
  else if(type==="date")detail="Choose the requested date.";
  else if(type==="number")detail="Enter the requested number.";
  else if(type==="checkbox"||type==="radio")detail="Select this option only when it applies to you.";
  else if(/name|first|last|surname|given|family/.test(autocomplete))detail="Enter the name requested by the form.";
  else if(/address|street|postal|zip|country|city/.test(autocomplete))detail="Enter the address details requested by the form.";
  else if(name&&!name.toLowerCase().startsWith("unlabelled"))detail=`Enter your ${name.toLowerCase()} here.`;
  const described=(e.getAttribute("aria-describedby")||"").split(/\s+/).filter(Boolean)
    .map(id=>e.ownerDocument?.getElementById(id)?.innerText||e.ownerDocument?.getElementById(id)?.textContent||"").join(" ");
  const help=deduplicateWords((described||e.getAttribute("title")||"").replace(/\s+/g," ").trim());
  if(help)detail+=` ${help}`;
  else if(e.placeholder&&norm(e.placeholder)!==norm(name))detail+=` Example: “${e.placeholder}”.`;
  const context=e.closest("fieldset")?.querySelector("legend")?.innerText;
  if(context&&!help)detail+=` This is part of “${deduplicateWords(context.trim())}”.`;
  return detail;
}

// ISSUE 3 RESOLVED: Search bar integrated directly inside "Fill out a form" mode
function formSteps(filterQuery=""){
  let fields=collect('input:not([type="hidden"]):not([type="submit"]):not([type="button"]),textarea,select').filter(e=>!e.disabled);
  if(filterQuery){
    const q=norm(filterQuery);
    fields=fields.filter((e,i)=>norm(fieldName(e,i)).includes(q)||norm(e.getAttribute("type")||"").includes(q)||norm(e.getAttribute("name")||"").includes(q));
  }
  return fields.map((e,idx)=>{
    const lbl=fieldName(e,idx);
    const required=e.required||e.getAttribute("aria-required")==="true";
    const type=e.getAttribute("type")||(e.tagName.toLowerCase()==="input"?"text":e.tagName.toLowerCase());
    return {
      el:e,title:`${lbl}${required?" · Required":""}`,
      detail:`${fieldDescription(e,lbl)} Field type: ${type}.`,
      score:30,reason:required?"The form marks this field as required.":"The form does not mark this field as required."
    };
  });
}

function navSteps(){
  return collect('a[href],button,[role="button"],[role="link"],summary').filter(e=>!e.disabled&&e.getAttribute("aria-disabled")!=="true"&&label(e).length>1).slice(0,20).map(e=>{
    const described=describeControl(e);
    return {el:e,title:deduplicateWords(label(e).slice(0,75)),detail:described.detail,reason:described.reason,score:20};
  });
}

function home(){
  clear();
  panel.dir = ["ar","ur"].includes(lang) ? "rtl" : "ltr";
  body.innerHTML=`<label class="label">${t("tag")}</label><select class="select" id="language">${LANGS.map(([v,n])=>`<option value="${v}" ${v===lang?"selected":""}>${n}</option>`).join("")}</select><div class="question">${t("question")}</div><p class="copy">${t("intro")}</p><button class="option" data-task="form"><b>📝 ${t("form")}</b><small>${t("formDesc")}</small></button><button class="option" data-task="find"><b>🔎 ${t("find")}</b><small>${t("findDesc")}</small></button><button class="option" data-task="nav"><b>🧭 ${t("nav")}</b><small>${t("navDesc")}</small></button><button class="option" data-task="custom"><b>🐾 ${t("custom")}</b><small>${t("customDesc")}</small></button><p class="note">🐈‍⬛ Larry says: no panic. You stay in control of every click.</p>`;
  body.querySelector("#language").onchange=e=>{lang=e.target.value;home()};
  body.querySelectorAll("[data-task]").forEach(b=>b.onclick=()=>begin(b.dataset.task));
}

async function begin(task){
  if(task==="form"){
    renderFormSearch();
    return;
  }
  if(task==="nav"){
    const local=navSteps();
    const remote=await embeddedSteps("nav");
    const a=combineSteps(local,remote,24);
    start(a.length?a:[{el:null,title:t("noNav"),detail:t("noNav"),reason:t("reason")}]);
    return;
  }
  const queryPlaceholder=task==="find"?t("placeholder"):(GOAL_PLACEHOLDERS[lang]||GOAL_PLACEHOLDERS.en);
  body.innerHTML=`<div class="question">${task==="find"?t("searchTitle"):t("goalTitle")}</div><p class="copy">${t("intro")}</p><input class="input" id="query" placeholder="${esc(queryPlaceholder)}"><div class="row"><button class="secondary" id="back">${t("back")}</button><button class="primary" id="go">${t("findBtn")}</button></div>`;
  body.querySelector("#back").onclick=home;
  const run=async()=>{
    let q=body.querySelector("#query").value.trim();
    if(!q){body.querySelector("#query").placeholder=t("empty");return;}
    const local=findMatches(q,task);
    const remote=await embeddedSteps(task==="custom"?"custom":"find",q);
    const matches=combineSteps(local,remote,5);
    if(matches.length)start(matches);
    else await offerGuidedJourney(q);
  };
  body.querySelector("#go").onclick=run;
  body.querySelector("#query").onkeydown=e=>{if(e.key==="Enter")run()};
  body.querySelector("#query").focus();
}

// Render search bar for Form filling mode
function renderFormSearch(){
  body.innerHTML=`<div class="question">${t("form")}</div><p class="copy">Find each field by its name and see a short note about what belongs there:</p><input class="input" id="form-search" placeholder="${t("filterPlaceholder")}"><div class="row"><button class="secondary" id="back">${t("back")}</button><button class="primary" id="start-form">${t("findBtn")}</button></div>`;
  body.querySelector("#back").onclick=home;
  const executeForm=async()=>{
    const q=body.querySelector("#form-search").value.trim();
    const local=formSteps(q);
    const remote=await embeddedSteps("form",q);
    const a=combineSteps(local,remote,40);
    start(a.length?a:[{el:null,title:t("noFields"),detail:t("noFields"),reason:"No visible fields were found here or in the embedded sections that ClickSimple can inspect."}]);
  };
  body.querySelector("#start-form").onclick=executeForm;
  body.querySelector("#form-search").onkeydown=e=>{if(e.key==="Enter")executeForm()};
  body.querySelector("#form-search").focus();
}

function start(a){
  steps=a.length?a:[{el:null,title:t("noMatch"),detail:t("noMatch"),reason:t("reason")}];
  idx=0; render();
}

function render(){
  const s=steps[idx];
  if(s.el)jump(s.el);else if(s.remote)jumpRemote(s);else clear();
  let pct=Math.round((idx+1)/steps.length*100);
  body.innerHTML=`<div class="step">${t("step")} ${idx+1} / ${steps.length}${s.remote?" · EMBEDDED PAGE":""}</div><div class="question">${esc(s.title)}</div><p class="instruction">${esc(s.detail)}</p><div class="reason"><b>${t("why")}</b><br>${esc(s.reason)}</div><div class="progress"><span style="width:${pct}%"></span></div><div class="row"><button class="secondary" id="back">${t("back")}</button><button class="primary" id="next">${idx===steps.length-1?t("finish"):t("next")}</button></div><p class="note">🐈‍⬛ Larry says: no panic. You stay in control of every click.</p>`;
  body.querySelector("#back").onclick=home;
  body.querySelector("#next").onclick=()=>{
    if(idx<steps.length-1){idx++;render()}else home();
  };
}

home();
restoreJourney();
})();
