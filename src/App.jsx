import { useState, useRef } from "react";

function App() {
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [currentStatus, setCurrentStatus] = useState("اضغط للبدء");
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [activeTab, setActiveTab] = useState("conversation"); // conversation or pronunciation
  const [pronunciationSentences, setPronunciationSentences] = useState([]);
  const [currentPronunciationIndex, setCurrentPronunciationIndex] = useState(0);
  const [pronunciationResults, setPronunciationResults] = useState([]);
  const [isRecordingPronunciation, setIsRecordingPronunciation] =
    useState(false);

  const recognitionRef = useRef(null);
  const conversationHistoryRef = useRef([]);
  const pronunciationRecognitionRef = useRef(null);

  // السيناريوهات المحسّنة
  const scenarios = [
    {
      id: 1,
      title: "محادثة في المقهى",
      icon: "coffee",
      color: "amber",
      description: "تعلم طلب المشروبات والتحدث مع الموظفين",
      systemPrompt: `أنت معلم لغة عربية محترف تتظاهر بأنك موظف في مقهى. مهمتك التعليمية:

1. التدريج في الصعوبة:
   - ابدأ بأسئلة بسيطة: "ماذا تريد أن تطلب؟"
   - ثم أسئلة أصعب: "هل تفضل القهوة الساخنة أم الباردة؟"
   - ثم محادثة طبيعية: "كيف كان يومك؟"

2. تقنيات التعليم:
   - اطرح سؤالاً واحداً واضحاً في كل مرة
   - استخدم مفردات المقهى: قهوة، شاي، كعك، حلويات، مقعد، طاولة
   - شجع المتعلم: "ممتاز"، "أحسنت"، "رائع"
   - إذا أخطأ، أعد صياغة الجملة الصحيحة في ردك بشكل طبيعي

3. قواعد الرد:
   - ردودك قصيرة جملة أو جملتين فقط
   - بالعربية الفصحى البسيطة
   - كن ودوداً ومشجعاً دائماً`,
      pronunciationSentences: [
        "أريد قهوة من فضلك",
        "هل عندكم كعك طازج؟",
        "كم سعر فنجان القهوة؟",
        "أفضل الشاي الأخضر",
        "هل يمكنني الجلوس هنا؟",
      ],
    },
    {
      id: 2,
      title: "التسوق في السوق",
      icon: "shopping",
      color: "green",
      description: "تعلم المساومة والشراء",
      systemPrompt: `أنت معلم لغة عربية محترف تتظاهر بأنك بائع في سوق. مهمتك التعليمية:

1. التدريج:
   - ابدأ: "أهلاً بك ماذا تريد أن تشتري؟"
   - تقدم: "كم تريد من هذا؟"، "ما رأيك في السعر؟"
   - متقدم: "يمكنني أن أعطيك خصماً"

2. تقنيات التعليم:
   - علّم المساومة والتفاوض
   - استخدم: سعر، ريال، رخيص، غالي، خصم، كيلو
   - شجع المتعلم على المساومة
   - صحح بلطف من خلال إعادة الصياغة

3. قواعد الرد:
   - ردودك قصيرة ومباشرة
   - كن ودوداً كبائع حقيقي`,
      pronunciationSentences: [
        "كم سعر هذا؟",
        "هل يمكن أن تخفض السعر؟",
        "أريد كيلو من البرتقال",
        "هذا غالٍ جداً",
        "سأشتري اثنين من فضلك",
      ],
    },
    {
      id: 3,
      title: "في المطعم",
      icon: "restaurant",
      color: "red",
      description: "تعلم طلب الطعام",
      systemPrompt: `أنت معلم لغة عربية محترف تتظاهر بأنك نادل في مطعم. مهمتك التعليمية:

1. التدريج:
   - ابدأ: "أهلاً تفضل القائمة. ماذا تريد أن تطلب؟"
   - تقدم: "هل تفضل اللحم أم الدجاج؟"
   - متقدم: "هل الطعام يعجبك؟"

2. تقنيات التعليم:
   - استخدم: قائمة، طبق، وجبة، مشروب، حساب
   - علّم الطلب بأدب: "من فضلك"، "شكراً"
   - شجع وصف الطعام

3. قواعد الرد:
   - كن مهذباً ومحترفاً
   - ردودك قصيرة`,
      pronunciationSentences: [
        "أريد أن أرى القائمة من فضلك",
        "ما هو الطبق المفضل عندكم؟",
        "سآخذ طبق الدجاج المشوي",
        "هل يمكنني الحصول على كوب ماء؟",
        "الحساب من فضلك",
      ],
    },
    {
      id: 4,
      title: "في المطار",
      icon: "airplane",
      color: "blue",
      description: "تعلم إجراءات السفر",
      systemPrompt: `أنت معلم لغة عربية محترف تتظاهر بأنك موظف في مطار. مهمتك التعليمية:

1. التدريج:
   - ابدأ: "أهلاً بك. هل معك جواز السفر والتذكرة؟"
   - تقدم: "إلى أين تسافر؟"، "كم حقيبة معك؟"
   - متقدم: "رحلتك من البوابة رقم خمسة"

2. تقنيات التعليم:
   - استخدم: تذكرة، جواز سفر، حقيبة، رحلة، بوابة
   - علّم المصطلحات الضرورية
   - شجع الأسئلة

3. قواعد الرد:
   - كن مهذباً ومساعداً
   - ردودك واضحة ومباشرة`,
      pronunciationSentences: [
        "أين مكتب تسجيل الوصول؟",
        "متى موعد إقلاع الطائرة؟",
        "أين البوابة رقم خمسة؟",
        "هل الرحلة في موعدها؟",
        "أحتاج إلى مساعدة مع الحقائب",
      ],
    },
    {
      id: 5,
      title: "عند الطبيب",
      icon: "hospital",
      color: "cyan",
      description: "تعلم وصف الأعراض",
      systemPrompt: `أنت معلم لغة عربية محترف تتظاهر بأنك طبيب. مهمتك التعليمية:

1. التدريج:
   - ابدأ: "أهلاً. ما المشكلة؟ أين تشعر بالألم؟"
   - تقدم: "منذ متى تشعر بهذا؟"
   - متقدم: "هل تأخذ أي أدوية؟"

2. تقنيات التعليم:
   - استخدم: ألم، صداع، حمى، دواء، علاج
   - علّم وصف الأعراض
   - كن لطيفاً ومطمئناً

3. قواعد الرد:
   - ردودك هادئة ومطمئنة
   - اطرح أسئلة طبية بسيطة`,
      pronunciationSentences: [
        "أشعر بألم في رأسي",
        "عندي حمى منذ يومين",
        "أحتاج إلى دواء للصداع",
        "متى يجب أن آخذ هذا الدواء؟",
        "هل يمكنني الحصول على وصفة طبية؟",
      ],
    },
    {
      id: 6,
      title: "في الفندق",
      icon: "hotel",
      color: "purple",
      description: "تعلم الحجز والاستفسار",
      systemPrompt: `أنت معلم لغة عربية محترف تتظاهر بأنك موظف استقبال في فندق. مهمتك التعليمية:

1. التدريج:
   - ابدأ: "أهلاً بك في الفندق. هل لديك حجز؟"
   - تقدم: "كم ليلة تريد أن تبقى؟"
   - متقدم: "هل تريد غرفة بإطلالة على البحر؟"

2. تقنيات التعليم:
   - استخدم: حجز، غرفة، ليلة، مفتاح، استقبال
   - علّم طلب الخدمات
   - شجع السؤال عن المرافق

3. قواعد الرد:
   - كن مهذباً ومرحباً
   - ردودك واضحة`,
      pronunciationSentences: [
        "أريد أن أحجز غرفة لليلتين",
        "كم سعر الغرفة في الليلة؟",
        "هل تشمل الإقامة وجبة الإفطار؟",
        "أين المصعد من فضلك؟",
        "هل يمكنني الحصول على منشفة إضافية؟",
      ],
    },
    {
      id: 7,
      title: "في البنك",
      icon: "bank",
      color: "indigo",
      description: "تعلم المعاملات المصرفية",
      systemPrompt: `أنت معلم لغة عربية محترف تتظاهر بأنك موظف بنك. مهمتك التعليمية:

1. التدريج:
   - ابدأ: "أهلاً. كيف يمكنني مساعدتك اليوم؟"
   - تقدم: "هل تريد فتح حساب أم إيداع نقود؟"
   - متقدم: "كم تريد أن تحول؟"

2. تقنيات التعليم:
   - استخدم: حساب، نقود، تحويل، بطاقة، رصيد
   - علّم المصطلحات المالية البسيطة
   - كن محترفاً ومساعداً

3. قواعد الرد:
   - ردودك رسمية ومهذبة
   - كن واضحاً في الشرح`,
      pronunciationSentences: [
        "أريد أن أفتح حساباً جديداً",
        "كم الرصيد في حسابي؟",
        "أريد أن أسحب ألف ريال",
        "هل يمكنني تحويل نقود؟",
        "أحتاج إلى بطاقة صراف جديدة",
      ],
    },
    {
      id: 8,
      title: "في الجامعة",
      icon: "university",
      color: "pink",
      description: "تعلم الحديث عن الدراسة",
      systemPrompt: `أنت معلم لغة عربية محترف تتظاهر بأنك طالب جامعي. مهمتك التعليمية:

1. التدريج:
   - ابدأ: "مرحباً ما تخصصك الدراسي؟"
   - تقدم: "ما المواد التي تدرسها هذا الفصل؟"
   - متقدم: "كيف تستعد للامتحانات؟"

2. تقنيات التعليم:
   - استخدم: محاضرة، امتحان، كتاب، بحث، تخصص
   - علّم الحديث عن الدراسة
   - شجع النقاش الأكاديمي

3. قواعد الرد:
   - كن ودوداً كزميل دراسة
   - ردودك محفزة`,
      pronunciationSentences: [
        "أدرس في كلية الهندسة",
        "عندي امتحان الأسبوع القادم",
        "أحتاج إلى الذهاب إلى المكتبة",
        "ما هي المادة المفضلة لديك؟",
        "هل يمكننا أن ندرس معاً؟",
      ],
    },
  ];

  const startConversation = (scenario) => {
    setSelectedScenario(scenario);
    setConversation([]);
    conversationHistoryRef.current = [];
    setShowSummary(false);
    setMessageCount(0);
    setActiveTab("conversation");
    setPronunciationSentences(scenario.pronunciationSentences);
    setCurrentPronunciationIndex(0);
    setPronunciationResults([]);

    const welcomeMessage = getWelcomeMessage(scenario);
    const aiMessage = { role: "ai", text: welcomeMessage };
    setConversation([aiMessage]);
    conversationHistoryRef.current.push(aiMessage);

    setTimeout(() => speak(welcomeMessage), 500);
    startListening();
  };

  const getWelcomeMessage = (scenario) => {
    const welcomes = {
      1: "أهلاً بك. أنا سعيد بخدمتك. ماذا تريد أن تطلب اليوم؟",
      2: "أهلاً. مرحباً بك في السوق. ماذا تريد أن تشتري؟",
      3: "أهلاً بك في المطعم. تفضل، ماذا تحب أن تطلب؟",
      4: "أهلاً بك في المطار. هل معك جواز السفر والتذكرة؟",
      5: "أهلاً بك. ما المشكلة؟ كيف يمكنني مساعدتك؟",
      6: "أهلاً بك في فندقنا. هل لديك حجز؟",
      7: "أهلاً. كيف يمكنني مساعدتك اليوم؟",
      8: "مرحباً. ما تخصصك الدراسي؟",
    };
    return welcomes[scenario.id] || "أهلاً بك. كيف يمكنني مساعدتك؟";
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("استخدم Chrome أو Edge");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "ar-SA";
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setCurrentStatus("استمع...");
    };

    recognitionRef.current.onresult = async (event) => {
      const userText = event.results[event.results.length - 1][0].transcript;

      const userMessage = { role: "user", text: userText };
      setConversation((prev) => [...prev, userMessage]);
      conversationHistoryRef.current.push(userMessage);
      setMessageCount((prev) => prev + 1);

      setCurrentStatus("يفكر...");
      await getAIResponse(userText);
    };

    recognitionRef.current.onerror = (event) => {
      if (event.error === "no-speech") {
        setCurrentStatus("لم أسمع شيئاً");
      } else {
        setCurrentStatus("خطأ في الميكروفون");
      }
    };

    recognitionRef.current.onend = () => {
      if (isListening && !showSummary) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error("Restart error:", error);
        }
      }
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Stop error:", error);
      }
      setIsListening(false);

      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      setCurrentStatus("متوقف مؤقتاً");
    }
  };

  const endSession = () => {
    stopListening();
    setCurrentStatus("جاري إنشاء التقييم...");
    generateSessionSummary();
  };

  const getAIResponse = async (userText) => {
    try {
      const messages = [
        {
          role: "system",
          content: selectedScenario.systemPrompt,
        },
        ...conversationHistoryRef.current.slice(-10).map((msg) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.text,
        })),
        {
          role: "user",
          content: userText,
        },
      ];

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              import.meta.env.VITE_GROQ_API_KEY ||
              "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"
            }`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: messages,
            temperature: 0.8,
            max_tokens: 100,
            top_p: 0.9,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      let aiText =
        data.choices[0]?.message?.content ||
        "عذراً، لم أفهم. هل يمكنك إعادة ذلك؟";
      aiText = aiText.trim();

      const aiMessage = { role: "ai", text: aiText };
      setConversation((prev) => [...prev, aiMessage]);
      conversationHistoryRef.current.push(aiMessage);

      speak(aiText);
    } catch (error) {
      console.error("AI Error:", error);
      const aiText = "رائع. أخبرني المزيد من فضلك.";
      const aiMessage = { role: "ai", text: aiText };
      setConversation((prev) => [...prev, aiMessage]);
      conversationHistoryRef.current.push(aiMessage);
      speak(aiText);
    }
  };

  const speak = (text) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(true);
    setCurrentStatus("يتحدث...");

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let currentIndex = 0;

    const speakNextSentence = () => {
      if (currentIndex >= sentences.length) {
        setIsSpeaking(false);
        setCurrentStatus("دورك...");
        return;
      }

      const utterance = new SpeechSynthesisUtterance(
        sentences[currentIndex].trim()
      );
      utterance.lang = "ar-SA";
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const arabicVoices = voices.filter(
        (voice) => voice.lang.startsWith("ar") && voice.localService === false
      );

      if (arabicVoices.length > 0) {
        utterance.voice = arabicVoices[0];
      }

      utterance.onend = () => {
        currentIndex++;
        setTimeout(speakNextSentence, 200);
      };

      utterance.onerror = (event) => {
        console.error("Speech error:", event);
        setIsSpeaking(false);
        setCurrentStatus("دورك...");
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNextSentence();
  };

  // نظام تدريب النطق
  const startPronunciationPractice = (sentence, index) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("استخدم Chrome أو Edge");
      return;
    }

    setIsRecordingPronunciation(true);
    setCurrentPronunciationIndex(index);

    pronunciationRecognitionRef.current = new SpeechRecognition();
    pronunciationRecognitionRef.current.lang = "ar-SA";
    pronunciationRecognitionRef.current.continuous = false;
    pronunciationRecognitionRef.current.interimResults = false;

    pronunciationRecognitionRef.current.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;

      // تحليل النطق
      const result = analyzePronunciation(sentence, spokenText, confidence);

      setPronunciationResults((prev) => {
        const newResults = [...prev];
        newResults[index] = result;
        return newResults;
      });

      setIsRecordingPronunciation(false);
    };

    pronunciationRecognitionRef.current.onerror = () => {
      setIsRecordingPronunciation(false);
    };

    pronunciationRecognitionRef.current.start();
  };

  const analyzePronunciation = (expected, spoken, confidence) => {
    const similarity = calculateSimilarity(expected, spoken);

    let score = 0;
    let feedback = "";
    let status = "incorrect";

    if (similarity > 0.8 && confidence > 0.7) {
      score = 100;
      feedback = "ممتاز! نطقك صحيح تماماً";
      status = "excellent";
    } else if (similarity > 0.6 && confidence > 0.5) {
      score = 75;
      feedback = "جيد! لكن حاول تحسين الوضوح قليلاً";
      status = "good";
    } else if (similarity > 0.4) {
      score = 50;
      feedback = "مقبول. حاول النطق ببطء أكثر";
      status = "fair";
    } else {
      score = 25;
      feedback = "حاول مرة أخرى. استمع للجملة جيداً";
      status = "incorrect";
    }

    return {
      expected,
      spoken,
      score,
      feedback,
      status,
      confidence: Math.round(confidence * 100),
    };
  };

  const calculateSimilarity = (str1, str2) => {
    const s1 = str1.toLowerCase().replace(/[^\u0600-\u06FF\s]/g, "");
    const s2 = str2.toLowerCase().replace(/[^\u0600-\u06FF\s]/g, "");

    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);

    let matches = 0;
    words1.forEach((word) => {
      if (words2.includes(word)) matches++;
    });

    return matches / Math.max(words1.length, words2.length);
  };

  const playAudioExample = (text) => {
    speak(text);
  };

  const generateSessionSummary = async () => {
    if (conversationHistoryRef.current.length < 3) {
      alert("المحادثة قصيرة جداً. حاول التحدث أكثر قليلاً.");
      setCurrentStatus("استمر في الحديث");
      return;
    }

    try {
      const conversationText = conversationHistoryRef.current
        .map(
          (msg) => `${msg.role === "user" ? "المتعلم" : "المعلم"}: ${msg.text}`
        )
        .join("\n");

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              import.meta.env.VITE_GROQ_API_KEY ||
              "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"
            }`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: `أنت معلم لغة عربية خبير. قيّم هذه المحادثة بدقة:

{
  "level": "مبتدئ أو متوسط أو متقدم",
  "score": رقم من 0 إلى 100,
  "strengths": ["نقطة قوة محددة 1", "نقطة قوة محددة 2", "نقطة قوة محددة 3"],
  "corrections": [
    {
      "error": "الجملة الخاطئة",
      "correction": "الجملة الصحيحة",
      "explanation": "شرح بسيط"
    }
  ],
  "tips": ["نصيحة 1", "نصيحة 2", "نصيحة 3"],
  "vocabularyUsed": ["كلمة 1", "كلمة 2", "كلمة 3"],
  "encouragement": "رسالة تشجيعية"
}`,
              },
              {
                role: "user",
                content: conversationText,
              },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        }
      );

      const data = await response.json();
      let summaryText = data.choices[0]?.message?.content || "{}";
      summaryText = summaryText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      try {
        const summary = JSON.parse(summaryText);
        setSessionSummary(summary);
        setShowSummary(true);
      } catch (parseError) {
        setSessionSummary({
          level: "متوسط",
          score: 75,
          strengths: ["تحدثت بثقة", "استخدمت جملاً كاملة", "شاركت في المحادثة"],
          corrections: [],
          tips: [
            "استمر في التدريب",
            "حاول استخدام مفردات أكثر",
            "تحدث ببطء وبوضوح",
          ],
          vocabularyUsed: [],
          encouragement: "أحسنت! استمر في التدرب.",
        });
        setShowSummary(true);
      }
    } catch (error) {
      console.error("Summary Error:", error);
      alert("حدث خطأ في إنشاء التقييم");
    }
  };

  const backToMenu = () => {
    stopListening();
    setSelectedScenario(null);
    setConversation([]);
    setShowSummary(false);
    setMessageCount(0);
    setCurrentStatus("اضغط للبدء");
  };

  const getIconSVG = (iconName) => {
    const icons = {
      coffee: (
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17 8h1a1 1 0 011 1v3a4 4 0 01-4 4h-1.101A5.002 5.002 0 019 18H5a5 5 0 010-10h8a5 5 0 014.899 4H18v-1a1 1 0 011-1zM5 8a3 3 0 000 6h4a3 3 0 000-6H5z" />
        </svg>
      ),
      shopping: (
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
      ),
      restaurant: (
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" />
        </svg>
      ),
      airplane: (
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      ),
      hospital: (
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      ),
      hotel: (
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      bank: (
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path
            fillRule="evenodd"
            d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
      university: (
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
        </svg>
      ),
    };
    return icons[iconName] || icons.coffee;
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      dir="rtl"
    >
      {/* الشاشة الرئيسية */}
      {!selectedScenario && (
        <div className="min-h-screen">
          {/* Header محسّن */}
          <header className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-lg bg-white/95">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg font-bold">ع</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">
                      تعلم العربية
                    </h1>
                    <p className="text-xs text-gray-500">
                      منصة تدريب صوتي تفاعلي
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-6 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>مجاني 100%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>تدريب صوتي</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>تقييم فوري</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Hero Section محسّن */}
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
                تحدث العربية بطلاقة
                <span className="block text-blue-600 mt-2">
                  مع التدريب الذكي
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                تدرب على المحادثة والنطق مع مساعد ذكي يصحح أخطاءك ويقيّم تقدمك
              </p>

              {/* المميزات */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="bg-white rounded-xl px-6 py-3 shadow-md border border-gray-200">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-semibold text-gray-900">
                      محادثة طبيعية
                    </span>
                  </div>
                </div>
                <div className="bg-white rounded-xl px-6 py-3 shadow-md border border-gray-200">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-semibold text-gray-900">
                      تدريب نطق
                    </span>
                  </div>
                </div>
                <div className="bg-white rounded-xl px-6 py-3 shadow-md border border-gray-200">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-semibold text-gray-900">
                      تقييم شامل
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* السيناريوهات - شبكة محسّنة */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                اختر موقف التدريب
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => startConversation(scenario)}
                    className="group bg-white hover:shadow-xl border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 rounded-2xl p-6 text-center"
                  >
                    <div
                      className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-${scenario.color}-500 to-${scenario.color}-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      {getIconSVG(scenario.icon)}
                    </div>
                    <h4 className="text-base font-bold text-gray-900 mb-2">
                      {scenario.title}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {scenario.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* شاشة المحادثة مع النطق */}
      {selectedScenario && !showSummary && (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={backToMenu}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span>رجوع</span>
                </button>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 bg-gradient-to-br from-${selectedScenario.color}-500 to-${selectedScenario.color}-600 rounded-xl flex items-center justify-center text-white shadow-md`}
                  >
                    {getIconSVG(selectedScenario.icon)}
                  </div>
                  <div className="text-right">
                    <h2 className="text-sm font-bold text-gray-900">
                      {selectedScenario.title}
                    </h2>
                    <p className="text-xs text-gray-600">
                      {messageCount} رسالة
                    </p>
                  </div>
                </div>

                <div className="w-20"></div>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm p-1 mb-6 flex gap-1">
              <button
                onClick={() => setActiveTab("conversation")}
                className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "conversation"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                المحادثة الحرة
              </button>
              <button
                onClick={() => setActiveTab("pronunciation")}
                className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "pronunciation"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                تدريب النطق
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* المحادثة أو النطق */}
              <div className="lg:col-span-2">
                {activeTab === "conversation" ? (
                  <div>
                    {/* الحالة */}
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            isListening
                              ? "bg-green-500 animate-pulse"
                              : "bg-gray-400"
                          }`}
                        ></div>
                        <span className="text-sm font-semibold text-gray-900">
                          {currentStatus}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {conversation.length} رسائل
                      </div>
                    </div>

                    {/* أزرار التحكم */}
                    <div className="flex gap-3 mb-6">
                      {!isListening ? (
                        <button
                          onClick={startListening}
                          disabled={isSpeaking}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 rounded-xl transition-all shadow-lg disabled:shadow-none"
                        >
                          {isSpeaking ? "انتظر..." : "متابعة المحادثة"}
                        </button>
                      ) : (
                        <button
                          onClick={stopListening}
                          className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-4 rounded-xl transition-all shadow-lg"
                        >
                          إيقاف مؤقت
                        </button>
                      )}

                      <button
                        onClick={endSession}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg"
                      >
                        إنهاء وتقييم
                      </button>
                    </div>

                    {/* نصيحة */}
                    {messageCount < 5 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>
                            <p className="text-sm font-semibold text-yellow-900 mb-1">
                              نصيحة للمبتدئين
                            </p>
                            <p className="text-xs text-yellow-800">
                              تحدث على الأقل 5-10 جمل للحصول على تقييم دقيق
                              ومفصل
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* المحادثة */}
                    <div className="bg-white rounded-xl shadow-sm p-6 h-[500px] overflow-y-auto">
                      {conversation.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                          <svg
                            className="w-16 h-16 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          <p className="text-sm font-medium">
                            ستظهر المحادثة هنا
                          </p>
                          <p className="text-xs mt-1">
                            اضغط "متابعة المحادثة" وابدأ التحدث
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {conversation.map((msg, index) => (
                            <div
                              key={index}
                              className={`flex ${
                                msg.role === "user"
                                  ? "justify-start"
                                  : "justify-end"
                              }`}
                            >
                              <div
                                className={`max-w-md px-5 py-3 rounded-2xl text-sm ${
                                  msg.role === "user"
                                    ? "bg-gray-100 text-gray-900 rounded-br-sm"
                                    : "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-bl-sm shadow-md"
                                }`}
                              >
                                <div className="font-bold text-xs mb-1 opacity-70">
                                  {msg.role === "user" ? "أنت" : "المعلم"}
                                </div>
                                <div className="leading-relaxed">
                                  {msg.text}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* تدريب النطق */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          تدريب النطق
                        </h3>
                        <p className="text-sm text-gray-600">
                          اضغط على الجملة لتسمعها، ثم سجل نطقك
                        </p>
                      </div>

                      <div className="space-y-4">
                        {pronunciationSentences.map((sentence, index) => {
                          const result = pronunciationResults[index];
                          return (
                            <div
                              key={index}
                              className={`border-2 rounded-xl p-5 transition-all ${
                                result
                                  ? result.status === "excellent"
                                    ? "border-green-500 bg-green-50"
                                    : result.status === "good"
                                    ? "border-blue-500 bg-blue-50"
                                    : result.status === "fair"
                                    ? "border-yellow-500 bg-yellow-50"
                                    : "border-red-500 bg-red-50"
                                  : "border-gray-200 hover:border-blue-500"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-1">
                                  <div className="text-sm font-semibold text-gray-900 mb-2">
                                    {sentence}
                                  </div>
                                  {result && (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-600">
                                          نطقك:
                                        </span>
                                        <span className="text-xs font-medium text-gray-900">
                                          {result.spoken}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-600">
                                          الدرجة:
                                        </span>
                                        <span
                                          className={`text-xs font-bold ${
                                            result.status === "excellent"
                                              ? "text-green-600"
                                              : result.status === "good"
                                              ? "text-blue-600"
                                              : result.status === "fair"
                                              ? "text-yellow-600"
                                              : "text-red-600"
                                          }`}
                                        >
                                          {result.score}/100
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-700">
                                        {result.feedback}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => playAudioExample(sentence)}
                                  className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold py-2 px-4 rounded-lg transition-colors"
                                >
                                  استمع للمثال
                                </button>
                                <button
                                  onClick={() =>
                                    startPronunciationPractice(sentence, index)
                                  }
                                  disabled={
                                    isRecordingPronunciation &&
                                    currentPronunciationIndex === index
                                  }
                                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-all"
                                >
                                  {isRecordingPronunciation &&
                                  currentPronunciationIndex === index
                                    ? "جاري التسجيل..."
                                    : "سجل نطقك"}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* الشريط الجانبي */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">
                    معلومات الجلسة
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-xs text-gray-700">السيناريو</span>
                      <span className="text-xs font-bold text-blue-900">
                        {selectedScenario.title}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-xs text-gray-700">عدد الرسائل</span>
                      <span className="text-lg font-bold text-green-900">
                        {messageCount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-xs text-gray-700">
                        تمارين النطق
                      </span>
                      <span className="text-lg font-bold text-purple-900">
                        {pronunciationResults.length}/
                        {pronunciationSentences.length}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-xs font-bold text-gray-900 mb-3">
                      نصائح سريعة
                    </h4>
                    <ul className="space-y-2 text-xs text-gray-600">
                      <li className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>تحدث بوضوح وببطء</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>استخدم جملاً كاملة</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>تدرب على النطق يومياً</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* شاشة الملخص */}
      {showSummary && sessionSummary && (
        <div className="min-h-screen py-12 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-4xl mx-auto px-6">
            {/* العنوان */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <svg
                  className="w-10 h-10 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">أحسنت</h2>
              <p className="text-base text-gray-600">
                {sessionSummary.encouragement}
              </p>
            </div>

            {/* المستوى والدرجة */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-8 text-center shadow-xl">
                <div className="text-sm mb-2 opacity-90">مستواك</div>
                <div className="text-3xl font-black">
                  {sessionSummary.level}
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl p-8 text-center shadow-xl">
                <div className="text-sm mb-2 opacity-90">درجتك</div>
                <div className="text-3xl font-black">
                  {sessionSummary.score}/100
                </div>
              </div>
            </div>

            {/* الإحصائيات */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {messageCount}
                  </div>
                  <div className="text-xs text-gray-600">رسالة</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {sessionSummary.strengths.length}
                  </div>
                  <div className="text-xs text-gray-600">نقاط قوة</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {sessionSummary.corrections.length}
                  </div>
                  <div className="text-xs text-gray-600">تصحيح</div>
                </div>
              </div>
            </div>

            {/* نقاط القوة */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>نقاط القوة</span>
              </h3>
              <div className="space-y-3">
                {sessionSummary.strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="flex gap-3 bg-green-50 p-4 rounded-xl"
                  >
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-sm text-gray-900">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* التصحيحات */}
            {sessionSummary.corrections &&
              sessionSummary.corrections.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>للتحسين</span>
                  </h3>
                  <div className="space-y-4">
                    {sessionSummary.corrections.map((correction, index) => (
                      <div
                        key={index}
                        className="bg-blue-50 p-4 rounded-xl space-y-3 text-sm"
                      >
                        <div className="flex items-start gap-2">
                          <svg
                            className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>
                            <span className="font-semibold text-red-600">
                              قلت:{" "}
                            </span>
                            <span className="text-gray-700">
                              {correction.error}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg
                            className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>
                            <span className="font-semibold text-green-600">
                              الصواب:{" "}
                            </span>
                            <span className="text-gray-900 font-medium">
                              {correction.correction}
                            </span>
                          </div>
                        </div>
                        {correction.explanation && (
                          <div className="flex items-start gap-2 bg-white p-3 rounded-lg">
                            <svg
                              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-gray-600 text-xs">
                              {correction.explanation}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* النصائح */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                <span>نصائح للتحسين</span>
              </h3>
              <div className="space-y-3">
                {sessionSummary.tips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex gap-3 bg-purple-50 p-4 rounded-xl"
                  >
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-sm text-gray-900">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* المفردات */}
            {sessionSummary.vocabularyUsed &&
              sessionSummary.vocabularyUsed.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                  <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    <span>مفردات استخدمتها</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sessionSummary.vocabularyUsed.map((word, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 text-xs px-4 py-2 rounded-full font-semibold"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* الأزرار */}
            <div className="flex gap-4">
              <button
                onClick={() => startConversation(selectedScenario)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
              >
                تدرب مرة أخرى
              </button>
              <button
                onClick={backToMenu}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 rounded-xl border-2 border-gray-300 transition-all"
              >
                القائمة الرئيسية
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
