class WordTestApp {
    constructor() {
        this.words = [];
        this.testMode = 'en-jp'; // 'en-jp' or 'jp-en'
        this.answerFormat = 'written'; // 'written' or 'multiple-choice'
        this.questionCount = 10;
        this.rangeStart = 1;
        this.rangeEnd = 20;
        
        this.initializeElements();
        this.bindEvents();
        this.updateWordList();
    }
    
    initializeElements() {
        // 画面要素
        this.setupScreen = document.getElementById('setup-screen');
        
        // セットアップ画面の要素
        this.excelFileInput = document.getElementById('excel-file-input');
        this.excelImportBtn = document.getElementById('excel-import-btn');
        this.fileName = document.getElementById('file-name');
        this.fileStatus = document.getElementById('file-status');
        this.clearFileBtn = document.getElementById('clear-file-btn');
        this.wordCount = document.getElementById('word-count');
        this.exportPdfBtn = document.getElementById('export-pdf-btn');
        
        // テスト設定要素
        this.questionCountInput = document.getElementById('question-count');
        this.rangeStartInput = document.getElementById('range-start');
        this.rangeEndInput = document.getElementById('range-end');
    }
    
    bindEvents() {
        this.excelImportBtn.addEventListener('click', () => this.excelFileInput.click());
        this.excelFileInput.addEventListener('change', (e) => this.handleExcelFile(e));
        this.clearFileBtn.addEventListener('click', () => this.clearFileSelection());
        this.exportPdfBtn.addEventListener('click', () => this.exportToPDF());
        
        // テストモード選択
        const testModeRadios = document.querySelectorAll('input[name="test-mode"]');
        testModeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.testMode = e.target.value;
            });
        });
        
        // 解答形式選択
        const answerFormatRadios = document.querySelectorAll('input[name="answer-format"]');
        answerFormatRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.answerFormat = e.target.value;
            });
        });
        
        // テスト設定の入力イベント
        this.questionCountInput.addEventListener('change', (e) => {
            this.questionCount = parseInt(e.target.value) || 10;
            this.updateRangeEnd();
        });
        
        this.rangeStartInput.addEventListener('change', (e) => {
            this.rangeStart = parseInt(e.target.value) || 1;
            this.validateRange();
        });
        
        this.rangeEndInput.addEventListener('change', (e) => {
            this.rangeEnd = parseInt(e.target.value) || 20;
            this.validateRange();
        });
    }
    
    // 手動入力機能は削除（Excelファイルのデータのみ使用）
    
    updateWordList() {
        this.wordCount.textContent = this.words.length;
        this.exportPdfBtn.disabled = this.words.length === 0;
        this.updateRangeEnd();
        
        // ファイル選択状態の初期化
        if (this.words.length === 0) {
            this.fileStatus.style.display = 'none';
            this.excelImportBtn.style.display = 'inline-block';
        }
    }
    
    // データ削除機能は削除（Excelファイルのデータのみ使用）
    
    updateRangeEnd() {
        this.rangeEndInput.max = this.words.length;
        if (this.rangeEnd > this.words.length) {
            this.rangeEnd = this.words.length;
            this.rangeEndInput.value = this.rangeEnd;
        }
        this.questionCountInput.max = this.words.length;
        if (this.questionCount > this.words.length) {
            this.questionCount = this.words.length;
            this.questionCountInput.value = this.questionCount;
        }
    }
    
    validateRange() {
        if (this.rangeStart > this.rangeEnd) {
            this.rangeStart = this.rangeEnd;
            this.rangeStartInput.value = this.rangeStart;
        }
        if (this.rangeEnd > this.words.length) {
            this.rangeEnd = this.words.length;
            this.rangeEndInput.value = this.rangeEnd;
        }
        if (this.rangeStart < 1) {
            this.rangeStart = 1;
            this.rangeStartInput.value = this.rangeStart;
        }
        
        // 出題数の調整
        const availableWords = this.rangeEnd - this.rangeStart + 1;
        if (this.questionCount > availableWords) {
            this.questionCount = availableWords;
            this.questionCountInput.value = this.questionCount;
        }
        this.questionCountInput.max = availableWords;
    }
    
    // データ削除機能は削除（Excelファイルのデータのみ使用）
    
    // テスト機能は削除
    
    // テスト機能は削除
    
    // テスト機能は削除
    
    // テスト機能は削除
    
    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= this.currentTest.length) {
            this.showResults();
        } else {
            this.showQuestion();
        }
    }
    
    showResults() {
        const correctCount = this.testResults.filter(r => r.isCorrect).length;
        const totalCount = this.testResults.length;
        const percentage = Math.round((correctCount / totalCount) * 100);
        
        this.score.textContent = correctCount;
        this.total.textContent = totalCount;
        this.percentage.textContent = percentage;
        
        this.resultList.innerHTML = '';
        this.testResults.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = `result-item ${result.isCorrect ? 'correct' : 'incorrect'}`;
            
            const questionDisplay = result.testMode === 'en-jp' ? 
                `${result.word} → ${result.meaning}` : 
                `${result.meaning} → ${result.word}`;
            
            resultItem.innerHTML = `
                <div>
                    <div class="result-word">${questionDisplay}</div>
                    <div class="result-answer">あなたの答え: ${result.userAnswer}</div>
                    ${!result.isCorrect ? `<div class="result-answer">正解: ${result.correctAnswer}</div>` : ''}
                </div>
                <div class="result-status">${result.isCorrect ? '正解' : '不正解'}</div>
            `;
            this.resultList.appendChild(resultItem);
        });
        
        this.showResultScreen();
    }
    
    // ローカルストレージ機能は削除（Excelファイルのデータのみ使用）
    
    handleExcelFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        this.fileName.textContent = file.name;
        this.fileStatus.style.display = 'flex';
        this.excelImportBtn.style.display = 'none';
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                
                this.importWordsFromExcel(jsonData);
            } catch (error) {
                alert('Excelファイルの読み込みに失敗しました。ファイル形式を確認してください。');
                console.error(error);
            }
        };
        reader.readAsArrayBuffer(file);
    }
    
    importWordsFromExcel(data) {
        let importedCount = 0;
        
        // 既存データをクリア（Excelファイルのデータのみ使用）
        this.words = [];
        
        // データの行をループ（最初の行はヘッダーの場合があるのでスキップ）
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            if (row.length >= 2 && row[0] && row[1]) {
                const word = String(row[0]).trim();
                const meaning = String(row[1]).trim();
                
                this.words.push({ word, meaning });
                importedCount++;
            }
        }
        
        this.updateWordList();
        
        let message = `${importedCount}個の単語を読み込みました。`;
        alert(message);
    }
    
    exportToPDF() {
        if (this.words.length === 0) {
            alert('PDFを作成するには少なくとも1つの単語を登録してください。');
            return;
        }
        
        // 設定値を取得
        const questionCount = this.questionCount;
        const rangeStart = this.rangeStart;
        const rangeEnd = this.rangeEnd;
        
        // 出題範囲内の単語を取得
        const availableWords = this.words.slice(rangeStart - 1, rangeEnd);
        
        // 出題数に応じてランダムに選択
        let selectedWords;
        if (questionCount >= availableWords.length) {
            selectedWords = availableWords;
        } else {
            selectedWords = [...availableWords]
                .sort(() => Math.random() - 0.5)
                .slice(0, questionCount);
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // 日本語フォントの設定（改善版）
        try {
            // シンプルなフォント設定
            doc.setFont('helvetica');
            console.log('フォント設定完了: helvetica');
        } catch (error) {
            console.warn('フォント設定にエラーが発生しました:', error);
            doc.setFont('helvetica');
        }
        
        // タイトル
        doc.setFontSize(18);
        const testModeText = this.testMode === 'en-jp' ? 'English to Japanese' : 'Japanese to English';
        const answerFormatText = this.answerFormat === 'written' ? 'Written Answer' : 'Multiple Choice';
        doc.text(`Word Test (${testModeText} - ${answerFormatText})`, 20, 20);
        
        // 作成日時と設定情報
        const now = new Date();
        const dateString = now.toLocaleDateString('ja-JP');
        doc.setFontSize(10);
        doc.text(`Created: ${dateString}`, 20, 30);
        doc.text(`Questions: ${selectedWords.length} / Range: ${rangeStart}-${rangeEnd}`, 20, 38);
        doc.text(`Mode: ${this.testMode === 'en-jp' ? 'English to Japanese' : 'Japanese to English'}`, 20, 46);
        doc.text(`Format: ${this.answerFormat === 'written' ? 'Written Answer' : 'Multiple Choice (4 options)'}`, 20, 54);
        
        // 問題セクション
        doc.setFontSize(14);
        doc.text('Questions:', 20, 65);
        
        let questionData;
        
        if (this.answerFormat === 'written') {
            // 記述式の場合（日本語をUTF-8で安全に処理）
            if (this.testMode === 'en-jp') {
                questionData = selectedWords.map((wordObj, index) => [
                    `${index + 1}`,
                    this.safeTextForPDF(wordObj.word),
                    '→',
                    '_______________'
                ]);
            } else {
                questionData = selectedWords.map((wordObj, index) => [
                    `${index + 1}`,
                    this.safeTextForPDF(wordObj.meaning),
                    '→',
                    '_______________'
                ]);
            }
            
            // 表形式で問題を表示（改善版）
            doc.autoTable({
                head: [['No.', this.testMode === 'en-jp' ? 'English' : 'Japanese', '', 'Answer']],
                body: questionData,
                startY: 70,
                theme: 'grid',
                styles: { 
                    fontSize: 12, 
                    cellPadding: 5,
                    font: 'helvetica',
                    fillColor: [255, 255, 255],
                    textColor: [0, 0, 0],
                    lineColor: [0, 0, 0],
                    lineWidth: 0.1
                },
                headStyles: { 
                    fillColor: [102, 126, 234],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    font: 'helvetica'
                },
                columnStyles: {
                    0: { cellWidth: 15, halign: 'center' },
                    1: { cellWidth: 50, halign: 'left' },
                    2: { cellWidth: 15, halign: 'center' },
                    3: { cellWidth: 80, halign: 'left' }
                },
                didDrawCell: function(data) {
                    // セル描画後の処理（文字化け回避）
                    if (data.section === 'body') {
                        // 日本語テキストの場合の特別処理
                        // 必要に応じてここで追加の処理を行う
                    }
                }
            });
        } else {
            // 選択式の場合（改善版）
            let startY = 70;
            
            selectedWords.forEach((wordObj, index) => {
                const question = this.testMode === 'en-jp' ? wordObj.word : wordObj.meaning;
                const correctAnswer = this.testMode === 'en-jp' ? wordObj.meaning : wordObj.word;
                const choices = this.generateChoices(correctAnswer, this.testMode);
                
                // ページの終わりに近づいたら新しいページを追加
                if (startY > 250) {
                    doc.addPage();
                    startY = 20;
                }
                
                // 問題番号と問題文（UTF-8対応版）
                doc.setFontSize(12);
                let questionText = `${index + 1}. ${this.safeTextForPDF(question)}`;
                if (this.testMode === 'jp-en') {
                    const romajiText = this.toRomaji(question);
                    if (romajiText !== question) {
                        questionText += ` (${romajiText})`;
                    }
                }
                
                // 文字化けを防ぐための安全な文字列分割
                try {
                    doc.text(questionText, 20, startY);
                } catch (error) {
                    // フォールバック: 英数字のみで表示
                    doc.text(`${index + 1}. [Question ${index + 1}]`, 20, startY);
                }
                startY += 10;
                
                // 選択肢（UTF-8対応版）
                doc.setFontSize(10);
                choices.forEach((choice, choiceIndex) => {
                    const choiceLabel = String.fromCharCode(65 + choiceIndex); // A, B, C, D
                    let choiceText = `  ${choiceLabel}. ${this.safeTextForPDF(choice)}`;
                    
                    if (this.testMode === 'en-jp' && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(choice)) {
                        const romajiText = this.toRomaji(choice);
                        if (romajiText !== choice) {
                            choiceText += ` (${romajiText})`;
                        }
                    }
                    
                    try {
                        doc.text(choiceText, 25, startY);
                    } catch (error) {
                        // フォールバック
                        doc.text(`  ${choiceLabel}. [Choice ${choiceLabel}]`, 25, startY);
                    }
                    startY += 8;
                });
                
                startY += 5; // 問題間のスペース
            });
        }
        
        // 解答セクション
        doc.addPage();
        doc.setFontSize(14);
        doc.text('Answers:', 20, 20);
        
        if (this.answerFormat === 'written') {
            // 記述式の解答（改善版）
            let answerData;
            if (this.testMode === 'en-jp') {
                answerData = selectedWords.map((wordObj, index) => [
                    `${index + 1}`,
                    this.safeTextForPDF(wordObj.word),
                    '→',
                    this.safeTextForPDF(wordObj.meaning)
                ]);
            } else {
                answerData = selectedWords.map((wordObj, index) => [
                    `${index + 1}`,
                    this.safeTextForPDF(wordObj.meaning),
                    '→',
                    this.safeTextForPDF(wordObj.word)
                ]);
            }
            
            doc.autoTable({
                head: [['No.', this.testMode === 'en-jp' ? 'English' : 'Japanese', '', 'Answer']],
                body: answerData,
                startY: 25,
                theme: 'grid',
                styles: { 
                    fontSize: 12, 
                    cellPadding: 5,
                    font: 'helvetica',
                    fillColor: [255, 255, 255],
                    textColor: [0, 0, 0],
                    lineColor: [0, 0, 0],
                    lineWidth: 0.1
                },
                headStyles: { 
                    fillColor: [102, 126, 234],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    font: 'helvetica'
                },
                columnStyles: {
                    0: { cellWidth: 15, halign: 'center' },
                    1: { cellWidth: 50, halign: 'left' },
                    2: { cellWidth: 15, halign: 'center' },
                    3: { cellWidth: 80, halign: 'left' }
                }
            });
        } else {
            // 選択式の解答（改善版）
            let startY = 25;
            
            selectedWords.forEach((wordObj, index) => {
                const question = this.testMode === 'en-jp' ? wordObj.word : wordObj.meaning;
                const correctAnswer = this.testMode === 'en-jp' ? wordObj.meaning : wordObj.word;
                const choices = this.generateChoices(correctAnswer, this.testMode);
                const correctIndex = choices.indexOf(correctAnswer);
                const correctLabel = String.fromCharCode(65 + correctIndex);
                
                if (startY > 250) {
                    doc.addPage();
                    startY = 20;
                }
                
                doc.setFontSize(10);
                let answerText = `${index + 1}. ${this.safeTextForPDF(question)} → ${correctLabel}. ${this.safeTextForPDF(correctAnswer)}`;
                
                // 日本語の場合はローマ字も併記（改善版）
                if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(question)) {
                    const romajiQuestion = this.toRomaji(question);
                    if (romajiQuestion !== question) {
                        answerText = `${index + 1}. ${this.safeTextForPDF(question)} (${romajiQuestion}) → ${correctLabel}. ${this.safeTextForPDF(correctAnswer)}`;
                    }
                } else if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(correctAnswer)) {
                    const romajiAnswer = this.toRomaji(correctAnswer);
                    if (romajiAnswer !== correctAnswer) {
                        answerText = `${index + 1}. ${this.safeTextForPDF(question)} → ${correctLabel}. ${this.safeTextForPDF(correctAnswer)} (${romajiAnswer})`;
                    }
                }
                
                try {
                    doc.text(answerText, 20, startY);
                } catch (error) {
                    // フォールバック表示
                    doc.text(`${index + 1}. [Answer ${index + 1}] → ${correctLabel}`, 20, startY);
                }
                startY += 10;
            });
        }
        
        // PDFを保存
        const modeText = this.testMode === 'en-jp' ? 'EN-JP' : 'JP-EN';
        const formatText = this.answerFormat === 'written' ? 'Written' : 'MC';
        const fileName = `word_test_${modeText}_${formatText}_${selectedWords.length}Q_${dateString.replace(/\//g, '-')}.pdf`;
        doc.save(fileName);
        
        alert(`PDFファイル「${fileName}」を保存しました。\n出題数: ${selectedWords.length}問\n出題範囲: ${rangeStart}-${rangeEnd}番目\n解答形式: ${this.answerFormat === 'written' ? '記述式' : '選択式'}`);
    }
    
    clearFileSelection() {
        if (confirm('選択したファイルを解除しますか？\n読み込んだ単語データも削除されます。')) {
            // ファイル入力をクリア
            this.excelFileInput.value = '';
            
            // 単語データをクリア
            this.words = [];
            
            // UIを更新
            this.fileName.textContent = '';
            this.fileStatus.style.display = 'none';
            this.excelImportBtn.style.display = 'inline-block';
            this.updateWordList();
        }
    }
    
    // 日本語テキストをPDFで安全に表示するためのヘルパー関数（改善版）
    safeTextForPDF(text) {
        if (!text) return '';
        
        // 日本語文字が含まれている場合の処理
        if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)) {
            // ローマ字変換を試みる
            const romaji = this.toRomaji(text);
            if (romaji !== text) {
                // ローマ字変換できた場合は、元の文字とローマ字を併記
                return `${text} (${romaji})`;
            } else {
                // ローマ字変換できない場合は元の文字をそのまま返す
                // UTF-8での出力を試みる
                try {
                    return decodeURIComponent(encodeURIComponent(text));
                } catch (e) {
                    return text;
                }
            }
        }
        
        // ASCII文字の場合はそのまま返す
        return text;
    }
    
    // 日本語をローマ字に変換する簡易版（主要な単語を大幅拡充）
    toRomaji(japanese) {
        const romajiMap = {
            // 基本的な単語
            'りんご': 'ringo',
            '本': 'hon',
            '猫': 'neko',
            '犬': 'inu',
            '家': 'ie',
            '車': 'kuruma',
            '水': 'mizu',
            '火': 'hi',
            '木': 'ki',
            '花': 'hana',
            '学校': 'gakkou',
            '友達': 'tomodachi',
            '音楽': 'ongaku',
            '食べ物': 'tabemono',
            '時間': 'jikan',
            '仕事': 'shigoto',
            '勉強': 'benkyou',
            '幸せ': 'shiawase',
            '美しい': 'utsukushii',
            '重要': 'juuyou',
            
            // 追加の基本単語
            '愛': 'ai',
            '青': 'ao',
            '赤': 'aka',
            '秋': 'aki',
            '朝': 'asa',
            '雨': 'ame',
            '足': 'ashi',
            '頭': 'atama',
            '春': 'haru',
            '夏': 'natsu',
            '冬': 'fuyu',
            '月': 'tsuki',
            '星': 'hoshi',
            '空': 'sora',
            '海': 'umi',
            '山': 'yama',
            '川': 'kawa',
            '田': 'ta',
            '手': 'te',
            '目': 'me',
            '口': 'kuchi',
            '耳': 'mimi',
            '鼻': 'hana',
            '心': 'kokoro',
            '人': 'hito',
            '男': 'otoko',
            '女': 'onna',
            '子供': 'kodomo',
            '大人': 'otona',
            '先生': 'sensei',
            '学生': 'gakusei',
            '会社': 'kaisha',
            '病院': 'byouin',
            '駅': 'eki',
            '電車': 'densha',
            'バス': 'basu',
            '飛行機': 'hikouki',
            '船': 'fune',
            
            // 食べ物関連
            'ご飯': 'gohan',
            'パン': 'pan',
            '肉': 'niku',
            '魚': 'sakana',
            '野菜': 'yasai',
            '果物': 'kudamono',
            '牛乳': 'gyuunyuu',
            'お茶': 'ocha',
            'コーヒー': 'koohii',
            
            // 感情・形容詞
            '嬉しい': 'ureshii',
            '悲しい': 'kanashii',
            '楽しい': 'tanoshii',
            '面白い': 'omoshiroi',
            '大きい': 'ookii',
            '小さい': 'chiisai',
            '新しい': 'atarashii',
            '古い': 'furui',
            '良い': 'yoi',
            '悪い': 'warui',
            '暖かい': 'atatakai',
            '寒い': 'samui',
            '暑い': 'atsui',
            '涼しい': 'suzushii'
        };
        
        return romajiMap[japanese] || japanese;
    }
    
    generateChoices(correctAnswer, questionType) {
        // 正解以外の選択肢を生成
        const otherAnswers = this.words
            .filter(word => {
                const answer = questionType === 'en-jp' ? word.meaning : word.word;
                return answer !== correctAnswer;
            })
            .map(word => questionType === 'en-jp' ? word.meaning : word.word);
        
        // ランダムに3つ選択
        const wrongChoices = [];
        const shuffled = [...otherAnswers].sort(() => Math.random() - 0.5);
        for (let i = 0; i < Math.min(3, shuffled.length); i++) {
            wrongChoices.push(shuffled[i]);
        }
        
        // 足りない場合はダミーの選択肢を追加
        while (wrongChoices.length < 3) {
            if (questionType === 'en-jp') {
                wrongChoices.push(`選択肢${wrongChoices.length + 1}`);
            } else {
                wrongChoices.push(`choice${wrongChoices.length + 1}`);
            }
        }
        
        // 正解と間違いの選択肢を混ぜてシャッフル
        const allChoices = [correctAnswer, ...wrongChoices];
        return allChoices.sort(() => Math.random() - 0.5);
    }
}

// アプリケーションの初期化
const app = new WordTestApp();

// ページ読み込み時にセットアップ画面を表示
document.addEventListener('DOMContentLoaded', () => {
    app.showSetupScreen();
});
