// All vocabulary words per language, organized by category/day
// Each entry: { word, meaning, emoji, category }

export const FLASHCARD_DECK = {
  spanish: [
    // Greetings
    { word: 'Hola', meaning: 'Hello', emoji: '👋', category: 'Greetings' },
    { word: 'Buenos días', meaning: 'Good morning', emoji: '🌅', category: 'Greetings' },
    { word: 'Buenas tardes', meaning: 'Good afternoon', emoji: '🌤️', category: 'Greetings' },
    { word: 'Buenas noches', meaning: 'Good night', emoji: '🌙', category: 'Greetings' },
    { word: 'Adiós', meaning: 'Goodbye', emoji: '👋', category: 'Greetings' },
    { word: '¿Cómo estás?', meaning: 'How are you?', emoji: '🤔', category: 'Greetings' },
    { word: 'Bien, gracias', meaning: 'Fine, thank you', emoji: '😊', category: 'Greetings' },
    { word: 'Mucho gusto', meaning: 'Nice to meet you', emoji: '🤝', category: 'Greetings' },
    // Basics
    { word: 'Sí', meaning: 'Yes', emoji: '✅', category: 'Basics' },
    { word: 'No', meaning: 'No', emoji: '❌', category: 'Basics' },
    { word: 'Por favor', meaning: 'Please', emoji: '🙏', category: 'Basics' },
    { word: 'Gracias', meaning: 'Thank you', emoji: '💙', category: 'Basics' },
    { word: 'De nada', meaning: "You're welcome", emoji: '😌', category: 'Basics' },
    { word: 'Lo siento', meaning: "I'm sorry", emoji: '😔', category: 'Basics' },
    { word: 'Perdón', meaning: 'Excuse me', emoji: '🙋', category: 'Basics' },
    // Numbers
    { word: 'Uno', meaning: 'One', emoji: '1️⃣', category: 'Numbers' },
    { word: 'Dos', meaning: 'Two', emoji: '2️⃣', category: 'Numbers' },
    { word: 'Tres', meaning: 'Three', emoji: '3️⃣', category: 'Numbers' },
    { word: 'Cuatro', meaning: 'Four', emoji: '4️⃣', category: 'Numbers' },
    { word: 'Cinco', meaning: 'Five', emoji: '5️⃣', category: 'Numbers' },
    { word: 'Diez', meaning: 'Ten', emoji: '🔟', category: 'Numbers' },
    // Family
    { word: 'Mamá', meaning: 'Mom', emoji: '👩', category: 'Family' },
    { word: 'Papá', meaning: 'Dad', emoji: '👨', category: 'Family' },
    { word: 'Hermano', meaning: 'Brother', emoji: '👦', category: 'Family' },
    { word: 'Hermana', meaning: 'Sister', emoji: '👧', category: 'Family' },
    { word: 'Abuelo', meaning: 'Grandfather', emoji: '👴', category: 'Family' },
    { word: 'Abuela', meaning: 'Grandmother', emoji: '👵', category: 'Family' },
    // Food
    { word: 'Agua', meaning: 'Water', emoji: '💧', category: 'Food' },
    { word: 'Pan', meaning: 'Bread', emoji: '🍞', category: 'Food' },
    { word: 'Leche', meaning: 'Milk', emoji: '🥛', category: 'Food' },
    { word: 'Fruta', meaning: 'Fruit', emoji: '🍎', category: 'Food' },
    { word: 'Carne', meaning: 'Meat', emoji: '🥩', category: 'Food' },
    { word: 'Arroz', meaning: 'Rice', emoji: '🍚', category: 'Food' },
    { word: 'Pollo', meaning: 'Chicken', emoji: '🍗', category: 'Food' },
    { word: 'Pescado', meaning: 'Fish', emoji: '🐟', category: 'Food' },
    // Animals
    { word: 'Gato', meaning: 'Cat', emoji: '🐱', category: 'Animals' },
    { word: 'Perro', meaning: 'Dog', emoji: '🐶', category: 'Animals' },
    { word: 'Pájaro', meaning: 'Bird', emoji: '🐦', category: 'Animals' },
    { word: 'Caballo', meaning: 'Horse', emoji: '🐴', category: 'Animals' },
    // Colors
    { word: 'Rojo', meaning: 'Red', emoji: '🔴', category: 'Colors' },
    { word: 'Azul', meaning: 'Blue', emoji: '🔵', category: 'Colors' },
    { word: 'Verde', meaning: 'Green', emoji: '🟢', category: 'Colors' },
    { word: 'Amarillo', meaning: 'Yellow', emoji: '🟡', category: 'Colors' },
    { word: 'Blanco', meaning: 'White', emoji: '⬜', category: 'Colors' },
    { word: 'Negro', meaning: 'Black', emoji: '⬛', category: 'Colors' },
  ],
  french: [
    { word: 'Bonjour', meaning: 'Hello', emoji: '👋', category: 'Greetings' },
    { word: 'Bonsoir', meaning: 'Good evening', emoji: '🌆', category: 'Greetings' },
    { word: 'Bonne nuit', meaning: 'Good night', emoji: '🌙', category: 'Greetings' },
    { word: 'Au revoir', meaning: 'Goodbye', emoji: '👋', category: 'Greetings' },
    { word: 'Salut', meaning: 'Hi', emoji: '😊', category: 'Greetings' },
    { word: 'Bien, merci', meaning: 'Fine, thank you', emoji: '😊', category: 'Greetings' },
    { word: 'Enchanté', meaning: 'Nice to meet you', emoji: '🤝', category: 'Greetings' },
    { word: 'Oui', meaning: 'Yes', emoji: '✅', category: 'Basics' },
    { word: 'Non', meaning: 'No', emoji: '❌', category: 'Basics' },
    { word: "S'il vous plaît", meaning: 'Please', emoji: '🙏', category: 'Basics' },
    { word: 'Merci', meaning: 'Thank you', emoji: '💙', category: 'Basics' },
    { word: 'De rien', meaning: "You're welcome", emoji: '😌', category: 'Basics' },
    { word: 'Pardon', meaning: 'Excuse me', emoji: '🙋', category: 'Basics' },
    { word: 'Un', meaning: 'One', emoji: '1️⃣', category: 'Numbers' },
    { word: 'Deux', meaning: 'Two', emoji: '2️⃣', category: 'Numbers' },
    { word: 'Trois', meaning: 'Three', emoji: '3️⃣', category: 'Numbers' },
    { word: 'Quatre', meaning: 'Four', emoji: '4️⃣', category: 'Numbers' },
    { word: 'Cinq', meaning: 'Five', emoji: '5️⃣', category: 'Numbers' },
    { word: 'Dix', meaning: 'Ten', emoji: '🔟', category: 'Numbers' },
    { word: 'Maman', meaning: 'Mom', emoji: '👩', category: 'Family' },
    { word: 'Papa', meaning: 'Dad', emoji: '👨', category: 'Family' },
    { word: 'Frère', meaning: 'Brother', emoji: '👦', category: 'Family' },
    { word: 'Sœur', meaning: 'Sister', emoji: '👧', category: 'Family' },
    { word: 'Eau', meaning: 'Water', emoji: '💧', category: 'Food' },
    { word: 'Pain', meaning: 'Bread', emoji: '🍞', category: 'Food' },
    { word: 'Lait', meaning: 'Milk', emoji: '🥛', category: 'Food' },
    { word: 'Fruit', meaning: 'Fruit', emoji: '🍎', category: 'Food' },
    { word: 'Chat', meaning: 'Cat', emoji: '🐱', category: 'Animals' },
    { word: 'Chien', meaning: 'Dog', emoji: '🐶', category: 'Animals' },
    { word: 'Rouge', meaning: 'Red', emoji: '🔴', category: 'Colors' },
    { word: 'Bleu', meaning: 'Blue', emoji: '🔵', category: 'Colors' },
    { word: 'Vert', meaning: 'Green', emoji: '🟢', category: 'Colors' },
    { word: 'Jaune', meaning: 'Yellow', emoji: '🟡', category: 'Colors' },
  ],
  german: [
    { word: 'Hallo', meaning: 'Hello', emoji: '👋', category: 'Greetings' },
    { word: 'Guten Morgen', meaning: 'Good morning', emoji: '🌅', category: 'Greetings' },
    { word: 'Guten Tag', meaning: 'Good day', emoji: '☀️', category: 'Greetings' },
    { word: 'Guten Abend', meaning: 'Good evening', emoji: '🌆', category: 'Greetings' },
    { word: 'Tschüss', meaning: 'Goodbye', emoji: '👋', category: 'Greetings' },
    { word: 'Gut, danke', meaning: 'Fine, thank you', emoji: '😊', category: 'Greetings' },
    { word: 'Ja', meaning: 'Yes', emoji: '✅', category: 'Basics' },
    { word: 'Nein', meaning: 'No', emoji: '❌', category: 'Basics' },
    { word: 'Bitte', meaning: 'Please', emoji: '🙏', category: 'Basics' },
    { word: 'Danke', meaning: 'Thank you', emoji: '💙', category: 'Basics' },
    { word: 'Entschuldigung', meaning: 'Excuse me', emoji: '🙋', category: 'Basics' },
    { word: 'Es tut mir leid', meaning: "I'm sorry", emoji: '😔', category: 'Basics' },
    { word: 'Eins', meaning: 'One', emoji: '1️⃣', category: 'Numbers' },
    { word: 'Zwei', meaning: 'Two', emoji: '2️⃣', category: 'Numbers' },
    { word: 'Drei', meaning: 'Three', emoji: '3️⃣', category: 'Numbers' },
    { word: 'Vier', meaning: 'Four', emoji: '4️⃣', category: 'Numbers' },
    { word: 'Fünf', meaning: 'Five', emoji: '5️⃣', category: 'Numbers' },
    { word: 'Zehn', meaning: 'Ten', emoji: '🔟', category: 'Numbers' },
    { word: 'Mama', meaning: 'Mom', emoji: '👩', category: 'Family' },
    { word: 'Papa', meaning: 'Dad', emoji: '👨', category: 'Family' },
    { word: 'Bruder', meaning: 'Brother', emoji: '👦', category: 'Family' },
    { word: 'Schwester', meaning: 'Sister', emoji: '👧', category: 'Family' },
    { word: 'Wasser', meaning: 'Water', emoji: '💧', category: 'Food' },
    { word: 'Brot', meaning: 'Bread', emoji: '🍞', category: 'Food' },
    { word: 'Milch', meaning: 'Milk', emoji: '🥛', category: 'Food' },
    { word: 'Katze', meaning: 'Cat', emoji: '🐱', category: 'Animals' },
    { word: 'Hund', meaning: 'Dog', emoji: '🐶', category: 'Animals' },
    { word: 'Rot', meaning: 'Red', emoji: '🔴', category: 'Colors' },
    { word: 'Blau', meaning: 'Blue', emoji: '🔵', category: 'Colors' },
    { word: 'Grün', meaning: 'Green', emoji: '🟢', category: 'Colors' },
    { word: 'Gelb', meaning: 'Yellow', emoji: '🟡', category: 'Colors' },
  ],
  japanese: [
    // Greetings
    { word: 'こんにちは', meaning: 'Hello', emoji: '👋', category: 'Greetings' },
    { word: 'おはようございます', meaning: 'Good morning', emoji: '🌅', category: 'Greetings' },
    { word: 'こんばんは', meaning: 'Good evening', emoji: '🌆', category: 'Greetings' },
    { word: 'さようなら', meaning: 'Goodbye', emoji: '👋', category: 'Greetings' },
    { word: 'はじめまして', meaning: 'Nice to meet you', emoji: '🤝', category: 'Greetings' },
    { word: 'おやすみなさい', meaning: 'Good night', emoji: '🌙', category: 'Greetings' },
    // Basics
    { word: 'ありがとうございます', meaning: 'Thank you', emoji: '🙏', category: 'Basics' },
    { word: 'はい', meaning: 'Yes', emoji: '✅', category: 'Basics' },
    { word: 'いいえ', meaning: 'No', emoji: '❌', category: 'Basics' },
    { word: 'すみません', meaning: 'Excuse me', emoji: '🙋', category: 'Basics' },
    { word: 'ごめんなさい', meaning: "I'm sorry", emoji: '😔', category: 'Basics' },
    { word: 'おねがいします', meaning: 'Please', emoji: '🤲', category: 'Basics' },
    { word: 'どういたしまして', meaning: "You're welcome", emoji: '😊', category: 'Basics' },
    { word: 'わかりました', meaning: 'I understand', emoji: '💡', category: 'Basics' },
    // Numbers
    { word: 'いち', meaning: 'One', emoji: '1️⃣', category: 'Numbers' },
    { word: 'に', meaning: 'Two', emoji: '2️⃣', category: 'Numbers' },
    { word: 'さん', meaning: 'Three', emoji: '3️⃣', category: 'Numbers' },
    { word: 'し・よん', meaning: 'Four', emoji: '4️⃣', category: 'Numbers' },
    { word: 'ご', meaning: 'Five', emoji: '5️⃣', category: 'Numbers' },
    { word: 'じゅう', meaning: 'Ten', emoji: '🔟', category: 'Numbers' },
    // Family
    { word: 'おかあさん', meaning: 'Mother', emoji: '👩', category: 'Family' },
    { word: 'おとうさん', meaning: 'Father', emoji: '👨', category: 'Family' },
    { word: 'おにいさん', meaning: 'Older brother', emoji: '👦', category: 'Family' },
    { word: 'おねえさん', meaning: 'Older sister', emoji: '👧', category: 'Family' },
    { word: 'おじいさん', meaning: 'Grandfather', emoji: '👴', category: 'Family' },
    { word: 'おばあさん', meaning: 'Grandmother', emoji: '👵', category: 'Family' },
    // Food
    { word: 'みず', meaning: 'Water', emoji: '💧', category: 'Food' },
    { word: 'パン', meaning: 'Bread', emoji: '🍞', category: 'Food' },
    { word: 'ぎゅうにゅう', meaning: 'Milk', emoji: '🥛', category: 'Food' },
    { word: 'くだもの', meaning: 'Fruit', emoji: '🍎', category: 'Food' },
    { word: 'にく', meaning: 'Meat', emoji: '🥩', category: 'Food' },
    { word: 'ごはん', meaning: 'Rice', emoji: '🍚', category: 'Food' },
    { word: 'とりにく', meaning: 'Chicken', emoji: '🍗', category: 'Food' },
    { word: 'さかな', meaning: 'Fish', emoji: '🐟', category: 'Food' },
    // Animals
    { word: 'ねこ', meaning: 'Cat', emoji: '🐱', category: 'Animals' },
    { word: 'いぬ', meaning: 'Dog', emoji: '🐶', category: 'Animals' },
    { word: 'とり', meaning: 'Bird', emoji: '🐦', category: 'Animals' },
    { word: 'うま', meaning: 'Horse', emoji: '🐴', category: 'Animals' },
    // Colors
    { word: 'あか', meaning: 'Red', emoji: '🔴', category: 'Colors' },
    { word: 'あお', meaning: 'Blue', emoji: '🔵', category: 'Colors' },
    { word: 'みどり', meaning: 'Green', emoji: '🟢', category: 'Colors' },
    { word: 'きいろ', meaning: 'Yellow', emoji: '🟡', category: 'Colors' },
    { word: 'しろ', meaning: 'White', emoji: '⬜', category: 'Colors' },
    { word: 'くろ', meaning: 'Black', emoji: '⬛', category: 'Colors' },
  ],
  korean: [
    // Greetings
    { word: '안녕하세요', meaning: 'Hello', emoji: '👋', category: 'Greetings' },
    { word: '좋은 아침이에요', meaning: 'Good morning', emoji: '🌅', category: 'Greetings' },
    { word: '안녕히 주무세요', meaning: 'Good night', emoji: '🌙', category: 'Greetings' },
    { word: '안녕히 가세요', meaning: 'Goodbye', emoji: '👋', category: 'Greetings' },
    { word: '처음 뵙겠습니다', meaning: 'Nice to meet you', emoji: '🤝', category: 'Greetings' },
    // Basics
    { word: '감사합니다', meaning: 'Thank you', emoji: '🙏', category: 'Basics' },
    { word: '네', meaning: 'Yes', emoji: '✅', category: 'Basics' },
    { word: '아니요', meaning: 'No', emoji: '❌', category: 'Basics' },
    { word: '실례합니다', meaning: 'Excuse me', emoji: '🙋', category: 'Basics' },
    { word: '죄송합니다', meaning: "I'm sorry", emoji: '😔', category: 'Basics' },
    { word: '부탁드립니다', meaning: 'Please', emoji: '🤲', category: 'Basics' },
    { word: '천만에요', meaning: "You're welcome", emoji: '😊', category: 'Basics' },
    // Numbers
    { word: '일', meaning: 'One', emoji: '1️⃣', category: 'Numbers' },
    { word: '이', meaning: 'Two', emoji: '2️⃣', category: 'Numbers' },
    { word: '삼', meaning: 'Three', emoji: '3️⃣', category: 'Numbers' },
    { word: '사', meaning: 'Four', emoji: '4️⃣', category: 'Numbers' },
    { word: '오', meaning: 'Five', emoji: '5️⃣', category: 'Numbers' },
    { word: '십', meaning: 'Ten', emoji: '🔟', category: 'Numbers' },
    // Family
    { word: '어머니', meaning: 'Mother', emoji: '👩', category: 'Family' },
    { word: '아버지', meaning: 'Father', emoji: '👨', category: 'Family' },
    { word: '오빠/형', meaning: 'Older brother', emoji: '👦', category: 'Family' },
    { word: '언니/누나', meaning: 'Older sister', emoji: '👧', category: 'Family' },
    { word: '할아버지', meaning: 'Grandfather', emoji: '👴', category: 'Family' },
    { word: '할머니', meaning: 'Grandmother', emoji: '👵', category: 'Family' },
    // Food
    { word: '물', meaning: 'Water', emoji: '💧', category: 'Food' },
    { word: '빵', meaning: 'Bread', emoji: '🍞', category: 'Food' },
    { word: '우유', meaning: 'Milk', emoji: '🥛', category: 'Food' },
    { word: '과일', meaning: 'Fruit', emoji: '🍎', category: 'Food' },
    { word: '고기', meaning: 'Meat', emoji: '🥩', category: 'Food' },
    { word: '밥', meaning: 'Rice', emoji: '🍚', category: 'Food' },
    // Animals
    { word: '고양이', meaning: 'Cat', emoji: '🐱', category: 'Animals' },
    { word: '개', meaning: 'Dog', emoji: '🐶', category: 'Animals' },
    { word: '새', meaning: 'Bird', emoji: '🐦', category: 'Animals' },
    // Colors
    { word: '빨간색', meaning: 'Red', emoji: '🔴', category: 'Colors' },
    { word: '파란색', meaning: 'Blue', emoji: '🔵', category: 'Colors' },
    { word: '초록색', meaning: 'Green', emoji: '🟢', category: 'Colors' },
    { word: '노란색', meaning: 'Yellow', emoji: '🟡', category: 'Colors' },
  ],
  italian: [
    { word: 'Ciao', meaning: 'Hello/Bye', emoji: '👋', category: 'Greetings' },
    { word: 'Buongiorno', meaning: 'Good morning', emoji: '🌅', category: 'Greetings' },
    { word: 'Buonasera', meaning: 'Good evening', emoji: '🌆', category: 'Greetings' },
    { word: 'Arrivederci', meaning: 'Goodbye', emoji: '👋', category: 'Greetings' },
    { word: 'Grazie', meaning: 'Thank you', emoji: '🙏', category: 'Basics' },
    { word: 'Sì', meaning: 'Yes', emoji: '✅', category: 'Basics' },
    { word: 'No', meaning: 'No', emoji: '❌', category: 'Basics' },
    { word: 'Per favore', meaning: 'Please', emoji: '🙏', category: 'Basics' },
    { word: 'Uno', meaning: 'One', emoji: '1️⃣', category: 'Numbers' },
    { word: 'Due', meaning: 'Two', emoji: '2️⃣', category: 'Numbers' },
    { word: 'Tre', meaning: 'Three', emoji: '3️⃣', category: 'Numbers' },
    { word: 'Gatto', meaning: 'Cat', emoji: '🐱', category: 'Animals' },
    { word: 'Cane', meaning: 'Dog', emoji: '🐶', category: 'Animals' },
    { word: 'Acqua', meaning: 'Water', emoji: '💧', category: 'Food' },
    { word: 'Pane', meaning: 'Bread', emoji: '🍞', category: 'Food' },
    { word: 'Rosso', meaning: 'Red', emoji: '🔴', category: 'Colors' },
    { word: 'Blu', meaning: 'Blue', emoji: '🔵', category: 'Colors' },
  ],
  portuguese: [
    { word: 'Olá', meaning: 'Hello', emoji: '👋', category: 'Greetings' },
    { word: 'Bom dia', meaning: 'Good morning', emoji: '🌅', category: 'Greetings' },
    { word: 'Boa tarde', meaning: 'Good afternoon', emoji: '🌤️', category: 'Greetings' },
    { word: 'Boa noite', meaning: 'Good night', emoji: '🌙', category: 'Greetings' },
    { word: 'Tchau', meaning: 'Bye', emoji: '👋', category: 'Greetings' },
    { word: 'Obrigado', meaning: 'Thank you', emoji: '🙏', category: 'Basics' },
    { word: 'Sim', meaning: 'Yes', emoji: '✅', category: 'Basics' },
    { word: 'Não', meaning: 'No', emoji: '❌', category: 'Basics' },
    { word: 'Por favor', meaning: 'Please', emoji: '🙏', category: 'Basics' },
    { word: 'Um', meaning: 'One', emoji: '1️⃣', category: 'Numbers' },
    { word: 'Dois', meaning: 'Two', emoji: '2️⃣', category: 'Numbers' },
    { word: 'Três', meaning: 'Three', emoji: '3️⃣', category: 'Numbers' },
    { word: 'Gato', meaning: 'Cat', emoji: '🐱', category: 'Animals' },
    { word: 'Cachorro', meaning: 'Dog', emoji: '🐶', category: 'Animals' },
    { word: 'Água', meaning: 'Water', emoji: '💧', category: 'Food' },
    { word: 'Pão', meaning: 'Bread', emoji: '🍞', category: 'Food' },
    { word: 'Vermelho', meaning: 'Red', emoji: '🔴', category: 'Colors' },
    { word: 'Azul', meaning: 'Blue', emoji: '🔵', category: 'Colors' },
  ],
  mandarin: [
    // Greetings
    { word: '你好', meaning: 'Hello', emoji: '👋', category: 'Greetings' },
    { word: '早上好', meaning: 'Good morning', emoji: '🌅', category: 'Greetings' },
    { word: '晚上好', meaning: 'Good evening', emoji: '🌆', category: 'Greetings' },
    { word: '再见', meaning: 'Goodbye', emoji: '👋', category: 'Greetings' },
    { word: '晚安', meaning: 'Good night', emoji: '🌙', category: 'Greetings' },
    { word: '你好吗？', meaning: 'How are you?', emoji: '🤔', category: 'Greetings' },
    { word: '很高兴认识你', meaning: 'Nice to meet you', emoji: '🤝', category: 'Greetings' },
    // Basics
    { word: '谢谢', meaning: 'Thank you', emoji: '🙏', category: 'Basics' },
    { word: '是', meaning: 'Yes', emoji: '✅', category: 'Basics' },
    { word: '不是', meaning: 'No', emoji: '❌', category: 'Basics' },
    { word: '请', meaning: 'Please', emoji: '🤲', category: 'Basics' },
    { word: '对不起', meaning: "I'm sorry", emoji: '😔', category: 'Basics' },
    { word: '没关系', meaning: "It's okay", emoji: '😊', category: 'Basics' },
    { word: '不客气', meaning: "You're welcome", emoji: '😌', category: 'Basics' },
    // Numbers
    { word: '一', meaning: 'One', emoji: '1️⃣', category: 'Numbers' },
    { word: '二', meaning: 'Two', emoji: '2️⃣', category: 'Numbers' },
    { word: '三', meaning: 'Three', emoji: '3️⃣', category: 'Numbers' },
    { word: '四', meaning: 'Four', emoji: '4️⃣', category: 'Numbers' },
    { word: '五', meaning: 'Five', emoji: '5️⃣', category: 'Numbers' },
    { word: '十', meaning: 'Ten', emoji: '🔟', category: 'Numbers' },
    // Family
    { word: '妈妈', meaning: 'Mother', emoji: '👩', category: 'Family' },
    { word: '爸爸', meaning: 'Father', emoji: '👨', category: 'Family' },
    { word: '哥哥', meaning: 'Older brother', emoji: '👦', category: 'Family' },
    { word: '姐姐', meaning: 'Older sister', emoji: '👧', category: 'Family' },
    { word: '爷爷', meaning: 'Grandfather', emoji: '👴', category: 'Family' },
    { word: '奶奶', meaning: 'Grandmother', emoji: '👵', category: 'Family' },
    // Food
    { word: '水', meaning: 'Water', emoji: '💧', category: 'Food' },
    { word: '面包', meaning: 'Bread', emoji: '🍞', category: 'Food' },
    { word: '牛奶', meaning: 'Milk', emoji: '🥛', category: 'Food' },
    { word: '水果', meaning: 'Fruit', emoji: '🍎', category: 'Food' },
    { word: '肉', meaning: 'Meat', emoji: '🥩', category: 'Food' },
    { word: '米饭', meaning: 'Rice', emoji: '🍚', category: 'Food' },
    { word: '鸡肉', meaning: 'Chicken', emoji: '🍗', category: 'Food' },
    { word: '鱼', meaning: 'Fish', emoji: '🐟', category: 'Food' },
    // Animals
    { word: '猫', meaning: 'Cat', emoji: '🐱', category: 'Animals' },
    { word: '狗', meaning: 'Dog', emoji: '🐶', category: 'Animals' },
    { word: '鸟', meaning: 'Bird', emoji: '🐦', category: 'Animals' },
    // Colors
    { word: '红色', meaning: 'Red', emoji: '🔴', category: 'Colors' },
    { word: '蓝色', meaning: 'Blue', emoji: '🔵', category: 'Colors' },
    { word: '绿色', meaning: 'Green', emoji: '🟢', category: 'Colors' },
    { word: '黄色', meaning: 'Yellow', emoji: '🟡', category: 'Colors' },
    { word: '白色', meaning: 'White', emoji: '⬜', category: 'Colors' },
    { word: '黑色', meaning: 'Black', emoji: '⬛', category: 'Colors' },
  ],
};

// SM-2 spaced repetition algorithm
// Returns next interval in days and new easiness factor
export function sm2(quality, repetitions, interval, easeFactor) {
  // quality: 0-5 (0-2 = fail, 3-5 = pass)
  let newRepetitions = repetitions;
  let newInterval = interval;
  let newEF = easeFactor;

  if (quality >= 3) {
    if (repetitions === 0) newInterval = 1;
    else if (repetitions === 1) newInterval = 6;
    else newInterval = Math.round(interval * easeFactor);
    newRepetitions = repetitions + 1;
  } else {
    newRepetitions = 0;
    newInterval = 1;
  }

  newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEF < 1.3) newEF = 1.3;

  return { interval: newInterval, repetitions: newRepetitions, easeFactor: newEF };
}

// Get cards due for review today from stored SRS data
export function getDueCards(deck, srsData) {
  const today = new Date().toISOString().split('T')[0];
  return deck.filter((card) => {
    const key = card.word;
    const data = srsData[key];
    if (!data) return true; // never seen
    return data.nextReview <= today;
  });
}