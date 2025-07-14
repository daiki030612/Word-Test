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
        this.exportHtml2PdfBtn = document.getElementById('export-html2pdf-btn');
        this.previewTestBtn = document.getElementById('preview-test-btn');
        this.previewAndPdfBtn = document.getElementById('preview-and-pdf-btn');
        
        // テスト設定要素
        this.questionCountInput = document.getElementById('question-count');
        this.rangeStartInput = document.getElementById('range-start');
        this.rangeEndInput = document.getElementById('range-end');
    }
    
    bindEvents() {
        this.excelImportBtn.addEventListener('click', () => this.excelFileInput.click());
        this.excelFileInput.addEventListener('change', (e) => this.handleExcelFile(e));
        this.clearFileBtn.addEventListener('click', () => this.clearFileSelection());
        this.exportHtml2PdfBtn.addEventListener('click', () => this.exportToHTML2PDF());
        this.previewTestBtn.addEventListener('click', () => this.previewTestInNewTab());
        this.previewAndPdfBtn.addEventListener('click', () => this.previewAndDownloadPDF());
        
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
        const hasWords = this.words.length > 0;
        this.exportHtml2PdfBtn.disabled = !hasWords;
        this.previewTestBtn.disabled = !hasWords;
        this.previewAndPdfBtn.disabled = !hasWords;
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
                `${result.word} => ${result.meaning}` : 
                `${result.meaning} => ${result.word}`;
            
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
    
    // html2pdf.js を使用したPDF生成
    async exportToHTML2PDF() {
        if (this.words.length === 0) {
            alert('PDFを作成するには少なくとも1つの単語を登録してください。');
            return;
        }
        
        try {
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
            
            // PDFテンプレートを作成
            this.createPDFTemplate(selectedWords);
            
            // Google Fontsが読み込まれるまで少し待つ
            await this.waitForFonts();
            
            // html2pdf.jsの設定
            const options = {
                margin: 15,
                filename: `word_test_${new Date().toISOString().slice(0, 10)}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    allowTaint: false
                }
            };
            
            // PDF生成
            const element = document.getElementById('pdf-template');
            element.style.display = 'block'; // 一時的に表示
            
            await html2pdf().set(options).from(element).save();
            
            element.style.display = 'none'; // 再び非表示
            
        } catch (error) {
            console.error('PDF生成エラー:', error);
            alert('PDF生成中にエラーが発生しました。ブラウザのコンソールを確認してください。');
        }
    }
    
    // PDFテンプレートを動的に作成
    createPDFTemplate(selectedWords) {
        const template = document.getElementById('pdf-template');
        const content = template.querySelector('.pdf-content');
        
        // ヘッダー情報を設定
        const testModeEl = content.querySelector('.test-mode');
        const testDateEl = content.querySelector('.test-date');
        const testSettingsEl = content.querySelector('.test-settings');
        const instructionsEl = content.querySelector('.answer-instructions');
        
        const testModeText = this.testMode === 'en-jp' ? '英語 → 日本語' : '日本語 → 英語';
        const answerFormatText = this.answerFormat === 'written' ? '記述式' : '選択式（4択）';
        
        testModeEl.textContent = `テストモード: ${testModeText} (${answerFormatText})`;
        testDateEl.textContent = `作成日: ${new Date().toLocaleDateString('ja-JP')}`;
        testSettingsEl.textContent = `問題数: ${selectedWords.length}問 / 出題範囲: ${this.rangeStart}-${this.rangeEnd}番目`;
        
        if (this.answerFormat === 'written') {
            instructionsEl.textContent = '各問題の答えを空欄に記入してください。';
        } else {
            instructionsEl.textContent = '各問題から最も適切な答えを選んでください（A、B、C、Dから選択）。';
        }
        
        // 問題セクションをクリアして再生成
        const questionsContainer = content.querySelector('.pdf-questions');
        questionsContainer.innerHTML = '';
        
        // 問題を生成
        selectedWords.forEach((wordObj, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'pdf-question';
            
            const questionNumber = document.createElement('div');
            questionNumber.className = 'pdf-question-number';
            questionNumber.textContent = `問題 ${index + 1}`;
            
            const questionText = document.createElement('div');
            questionText.className = 'pdf-question-text';
            
            if (this.testMode === 'en-jp') {
                questionText.textContent = wordObj.word;
            } else {
                questionText.textContent = wordObj.meaning;
            }
            
            questionDiv.appendChild(questionNumber);
            questionDiv.appendChild(questionText);
            
            if (this.answerFormat === 'written') {
                // 記述式の場合
                const answerSpace = document.createElement('div');
                answerSpace.className = 'pdf-written-answer';
                answerSpace.innerHTML = '解答: <span class="pdf-answer-space"></span>';
                questionDiv.appendChild(answerSpace);
            } else {
                // 選択式の場合
                const correctAnswer = this.testMode === 'en-jp' ? wordObj.meaning : wordObj.word;
                const choices = this.generateChoices(correctAnswer, this.testMode);
                
                const choicesContainer = document.createElement('div');
                choicesContainer.className = 'pdf-question-choices';
                
                choices.forEach((choice, choiceIndex) => {
                    const choiceDiv = document.createElement('div');
                    choiceDiv.className = 'pdf-choice';
                    const choiceLabel = String.fromCharCode(65 + choiceIndex); // A, B, C, D
                    choiceDiv.textContent = `${choiceLabel}. ${choice}`;
                    choicesContainer.appendChild(choiceDiv);
                });
                
                questionDiv.appendChild(choicesContainer);
            }
            
            questionsContainer.appendChild(questionDiv);
        });
    }
    
    // フォントの読み込み完了を待つ
    waitForFonts() {
        return new Promise((resolve) => {
            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(() => {
                    // 追加で少し待つ（安全のため）
                    setTimeout(resolve, 500);
                });
            } else {
                // フォールバック
                setTimeout(resolve, 1000);
            }
        });
    }
    

    

    
    generateChoices(correctAnswer, questionType) {
        console.log('generateChoices called:', { correctAnswer, questionType });
        
        // 正解以外の選択肢を生成
        const otherAnswers = this.words
            .filter(word => {
                const answer = questionType === 'en-jp' ? word.meaning : word.word;
                return answer !== correctAnswer;
            })
            .map(word => questionType === 'en-jp' ? word.meaning : word.word);
        
        console.log('Available other answers:', otherAnswers.slice(0, 5)); // 最初の5つを表示
        
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
        const finalChoices = allChoices.sort(() => Math.random() - 0.5);
        
        console.log('Generated choices:', finalChoices);
        return finalChoices;
    }
    
    // 新しいタブでテストをプレビューする機能
    previewTestInNewTab() {
        if (this.words.length === 0) {
            alert('プレビューするには少なくとも1つの単語を登録してください。');
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
        
        // HTMLページを生成
        const htmlContent = this.generateTestHTML(selectedWords);
        
        // 新しいタブで開く
        const newTab = window.open('', '_blank');
        newTab.document.write(htmlContent);
        newTab.document.close();
    }
    
    // プレビュー表示とPDF化を同時に実行する機能
    previewAndDownloadPDF() {
        if (this.words.length === 0) {
            alert('プレビューとPDF生成するには少なくとも1つの単語を登録してください。');
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
        
        // HTMLページを生成（自動PDF化機能付き）
        const htmlContent = this.generateTestHTMLWithAutoPDF(selectedWords);
        
        // 新しいタブで開く
        const newTab = window.open('', '_blank');
        newTab.document.write(htmlContent);
        newTab.document.close();
        
        // 成功メッセージ
        alert('プレビューページを表示しました。5秒後に自動でPDFダウンロードが開始されます。');
    }
    
    // テスト用のHTMLページを生成
    generateTestHTML(selectedWords) {
        const testModeText = this.testMode === 'en-jp' ? '英語 → 日本語' : '日本語 → 英語';
        const answerFormatText = this.answerFormat === 'written' ? '記述式' : '選択式（4択）';
        const now = new Date();
        const dateString = now.toLocaleDateString('ja-JP');
        
        let questionsHTML = '';
        
        selectedWords.forEach((wordObj, index) => {
            const question = this.testMode === 'en-jp' ? wordObj.word : wordObj.meaning;
            
            questionsHTML += `
                <div class="question">
                    <div class="question-number">問題 ${index + 1}</div>
                    <div class="question-text">${question}</div>
            `;
            
            if (this.answerFormat === 'written') {
                // 記述式の場合
                questionsHTML += `
                    <div class="written-answer">
                        解答: <span class="answer-space">_______________</span>
                    </div>
                `;
            } else {
                // 選択式の場合
                const correctAnswer = this.testMode === 'en-jp' ? wordObj.meaning : wordObj.word;
                const choices = this.generateChoices(correctAnswer, this.testMode);
                
                questionsHTML += `<div class="question-choices">`;
                choices.forEach((choice, choiceIndex) => {
                    const choiceLabel = String.fromCharCode(65 + choiceIndex); // A, B, C, D
                    questionsHTML += `
                        <div class="choice">
                            ${choiceLabel}. ${choice}
                        </div>
                    `;
                });
                questionsHTML += `</div>`;
            }
            
            questionsHTML += `</div>`;
        });
        
        // 解答ページを生成
        let answersHTML = '';
        selectedWords.forEach((wordObj, index) => {
            const question = this.testMode === 'en-jp' ? wordObj.word : wordObj.meaning;
            const answer = this.testMode === 'en-jp' ? wordObj.meaning : wordObj.word;
            
            if (this.answerFormat === 'written') {
                answersHTML += `
                    <div class="answer-item">
                        ${index + 1}. ${question} → ${answer}
                    </div>
                `;
            } else {
                const correctAnswer = this.testMode === 'en-jp' ? wordObj.meaning : wordObj.word;
                const choices = this.generateChoices(correctAnswer, this.testMode);
                const correctIndex = choices.indexOf(correctAnswer);
                const correctLabel = String.fromCharCode(65 + correctIndex);
                
                answersHTML += `
                    <div class="answer-item">
                        ${index + 1}. ${question} → ${correctLabel}. ${answer}
                    </div>
                `;
            }
        });
        
        return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>単語テスト - ${testModeText}</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- html2pdf.js for PDF generation -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Noto Sans JP', 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8fafc;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            position: relative;
        }
        
        .header-actions {
            position: absolute;
            top: 20px;
            right: 20px;
        }
        
        .pdf-download-btn {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .pdf-download-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px);
        }
        
        .title {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .test-info {
            font-size: 1rem;
            opacity: 0.9;
        }
        
        .content {
            padding: 30px;
        }
        
        .instructions {
            background: #e0f2fe;
            border: 1px solid #81d4fa;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }
        
        .instructions h3 {
            color: #01579b;
            margin-bottom: 10px;
        }
        
        .question {
            background: #ffffff;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 20px;
            transition: border-color 0.3s ease;
        }
        
        .question:hover {
            border-color: #667eea;
        }
        
        .question-number {
            background: #667eea;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.9rem;
            display: inline-block;
            margin-bottom: 15px;
        }
        
        .question-text {
            font-size: 1.3rem;
            font-weight: 500;
            color: #2d3748;
            margin-bottom: 20px;
        }
        
        .written-answer {
            font-size: 1.1rem;
            color: #4a5568;
        }
        
        .answer-space {
            display: inline-block;
            border-bottom: 2px solid #4a5568;
            min-width: 200px;
            padding: 5px 10px;
            margin-left: 10px;
        }
        
        .question-choices {
            display: grid;
            gap: 12px;
        }
        
        .choice {
            background: #f7fafc;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px 20px;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .choice:hover {
            background: #edf2f7;
            border-color: #cbd5e0;
        }
        
        .answers-section {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 3px solid #e2e8f0;
        }
        
        .answers-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 25px;
            text-align: center;
        }
        
        .answer-item {
            background: #f0fff4;
            border: 1px solid #9ae6b4;
            border-radius: 8px;
            padding: 15px 20px;
            margin-bottom: 10px;
            font-size: 1.1rem;
        }
        
        .footer {
            background: #f7fafc;
            padding: 20px;
            text-align: center;
            color: #718096;
            border-top: 1px solid #e2e8f0;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .container {
                box-shadow: none;
                border-radius: 0;
            }
            
            .answers-section {
                page-break-before: always;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-actions">
                <button class="pdf-download-btn" onclick="downloadAsPDF()">📄 PDFでダウンロード</button>
            </div>
            <h1 class="title">📚 単語テスト</h1>
            <div class="test-info">
                <div>テストモード: ${testModeText} (${answerFormatText})</div>
                <div>作成日: ${dateString}</div>
                <div>問題数: ${selectedWords.length}問 / 出題範囲: ${this.rangeStart}-${this.rangeEnd}番目</div>
            </div>
        </div>
        
        <div class="content">
            <div class="instructions">
                <h3>📋 解答方法</h3>
                <p>${this.answerFormat === 'written' ? '各問題の答えを空欄に記入してください。' : '各問題から最も適切な答えを選んでください（A、B、C、Dから選択）。'}</p>
            </div>
            
            <div class="questions">
                ${questionsHTML}
            </div>
        </div>
        
        <div class="answers-section">
            <div class="content">
                <h2 class="answers-title">📝 解答</h2>
                <div class="answers">
                    ${answersHTML}
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>English Vocabulary Test App - Generated on ${dateString}</p>
        </div>
    </div>
    
    <script>
        // PDFダウンロード機能
        async function downloadAsPDF() {
            try {
                // PDFダウンロードボタンを一時的に非表示
                const downloadBtn = document.querySelector('.pdf-download-btn');
                const originalDisplay = downloadBtn.style.display;
                downloadBtn.style.display = 'none';
                
                // PDF生成設定
                const options = {
                    margin: 10,
                    filename: 'vocabulary-test-${new Date().toISOString().slice(0, 10)}.pdf',
                    image: { type: 'jpeg', quality: 0.95 },
                    html2canvas: { 
                        scale: 2,
                        useCORS: true,
                        letterRendering: true,
                        allowTaint: true
                    }
                };
                
                // PDF生成とダウンロード
                const element = document.querySelector('.container');
                await html2pdf().set(options).from(element).save();
                
                // ボタンを元に戻す
                downloadBtn.style.display = originalDisplay;
                
                alert('PDFのダウンロードが完了しました！');
                
            } catch (error) {
                console.error('PDF生成エラー:', error);
                alert('PDF生成中にエラーが発生しました。ブラウザのコンソールを確認してください。');
                
                // ボタンを元に戻す
                const downloadBtn = document.querySelector('.pdf-download-btn');
                if (downloadBtn) downloadBtn.style.display = originalDisplay;
            }
        }
        
        // ページ読み込み完了時にメッセージ表示
        document.addEventListener('DOMContentLoaded', () => {
            console.log('単語テストページが読み込まれました');
            console.log('右上の「PDFでダウンロード」ボタンでPDF化できます');
        });
    </script>
</body>
</html>
        `;
    }
    
    // 自動PDF化機能付きのテスト用HTMLページを生成
    generateTestHTMLWithAutoPDF(selectedWords) {
        const testModeText = this.testMode === 'en-jp' ? '英語 → 日本語' : '日本語 → 英語';
        const answerFormatText = this.answerFormat === 'written' ? '記述式' : '選択式（4択）';
        const now = new Date();
        const dateString = now.toLocaleDateString('ja-JP');
        
        let questionsHTML = '';
        
        selectedWords.forEach((wordObj, index) => {
            const question = this.testMode === 'en-jp' ? wordObj.word : wordObj.meaning;
            
            questionsHTML += `
                <div class="question">
                    <div class="question-number">問題 ${index + 1}</div>
                    <div class="question-text">${question}</div>
            `;
            
            if (this.answerFormat === 'written') {
                // 記述式の場合
                questionsHTML += `
                    <div class="written-answer">
                        解答: <span class="answer-space">_______________</span>
                    </div>
                `;
            } else {
                // 選択式の場合
                const correctAnswer = this.testMode === 'en-jp' ? wordObj.meaning : wordObj.word;
                const choices = this.generateChoices(correctAnswer, this.testMode);
                
                questionsHTML += `<div class="question-choices">`;
                choices.forEach((choice, choiceIndex) => {
                    const choiceLabel = String.fromCharCode(65 + choiceIndex); // A, B, C, D
                    questionsHTML += `
                        <div class="choice">
                            ${choiceLabel}. ${choice}
                        </div>
                    `;
                });
                questionsHTML += `</div>`;
            }
            
            questionsHTML += `</div>`;
        });
        
        // 解答ページを生成
        let answersHTML = '';
        selectedWords.forEach((wordObj, index) => {
            const question = this.testMode === 'en-jp' ? wordObj.word : wordObj.meaning;
            const answer = this.testMode === 'en-jp' ? wordObj.meaning : wordObj.word;
            
            if (this.answerFormat === 'written') {
                answersHTML += `
                    <div class="answer-item">
                        ${index + 1}. ${question} → ${answer}
                    </div>
                `;
            } else {
                const correctAnswer = this.testMode === 'en-jp' ? wordObj.meaning : wordObj.word;
                const choices = this.generateChoices(correctAnswer, this.testMode);
                const correctIndex = choices.indexOf(correctAnswer);
                const correctLabel = String.fromCharCode(65 + correctIndex);
                
                answersHTML += `
                    <div class="answer-item">
                        ${index + 1}. ${question} → ${correctLabel}. ${answer}
                    </div>
                `;
            }
        });
        
        return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>単語テスト - ${testModeText}</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- html2pdf.js for PDF generation -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Noto Sans JP', 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8fafc;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            position: relative;
        }
        
        .header-actions {
            position: absolute;
            top: 20px;
            right: 20px;
        }
        
        .pdf-download-btn {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .pdf-download-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px);
        }
        
        .auto-download-notice {
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 10px 15px;
            margin-top: 15px;
            font-size: 0.9rem;
            text-align: center;
        }
        
        .title {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .test-info {
            font-size: 1rem;
            opacity: 0.9;
        }
        
        .content {
            padding: 30px;
        }
        
        .instructions {
            background: #e0f2fe;
            border: 1px solid #81d4fa;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }
        
        .instructions h3 {
            color: #01579b;
            margin-bottom: 10px;
        }
        
        .question {
            background: #ffffff;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 20px;
            transition: border-color 0.3s ease;
        }
        
        .question:hover {
            border-color: #667eea;
        }
        
        .question-number {
            background: #667eea;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.9rem;
            display: inline-block;
            margin-bottom: 15px;
        }
        
        .question-text {
            font-size: 1.3rem;
            font-weight: 500;
            color: #2d3748;
            margin-bottom: 20px;
        }
        
        .written-answer {
            font-size: 1.1rem;
            color: #4a5568;
        }
        
        .answer-space {
            display: inline-block;
            border-bottom: 2px solid #4a5568;
            min-width: 200px;
            padding: 5px 10px;
            margin-left: 10px;
        }
        
        .question-choices {
            display: grid;
            gap: 12px;
        }
        
        .choice {
            background: #f7fafc;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px 20px;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .choice:hover {
            background: #edf2f7;
            border-color: #cbd5e0;
        }
        
        .answers-section {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 3px solid #e2e8f0;
        }
        
        .answers-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 25px;
            text-align: center;
        }
        
        .answer-item {
            background: #f0fff4;
            border: 1px solid #9ae6b4;
            border-radius: 8px;
            padding: 15px 20px;
            margin-bottom: 10px;
            font-size: 1.1rem;
        }
        
        .footer {
            background: #f7fafc;
            padding: 20px;
            text-align: center;
            color: #718096;
            border-top: 1px solid #e2e8f0;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .container {
                box-shadow: none;
                border-radius: 0;
            }
            
            .answers-section {
                page-break-before: always;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-actions">
                <button class="pdf-download-btn" onclick="downloadAsPDF()">📄 PDFでダウンロード</button>
            </div>
            <h1 class="title">📚 単語テスト</h1>
            <div class="test-info">
                <div>テストモード: ${testModeText} (${answerFormatText})</div>
                <div>作成日: ${dateString}</div>
                <div>問題数: ${selectedWords.length}問 / 出題範囲: ${this.rangeStart}-${this.rangeEnd}番目</div>
            </div>
            <div class="auto-download-notice">
                🔄 自動でPDFダウンロードを開始中...
            </div>
        </div>
        
        <div class="content">
            <div class="instructions">
                <h3>📋 解答方法</h3>
                <p>${this.answerFormat === 'written' ? '各問題の答えを空欄に記入してください。' : '各問題から最も適切な答えを選んでください（A、B、C、Dから選択）。'}</p>
            </div>
            
            <div class="questions">
                ${questionsHTML}
            </div>
        </div>
        
        <div class="answers-section">
            <div class="content">
                <h2 class="answers-title">📝 解答</h2>
                <div class="answers">
                    ${answersHTML}
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>English Vocabulary Test App - Generated on ${dateString}</p>
        </div>
    </div>
    
    <script>
        // PDFダウンロード機能
        async function downloadAsPDF() {
            try {
                // PDFダウンロードボタンと通知を一時的に非表示
                const downloadBtn = document.querySelector('.pdf-download-btn');
                const notice = document.querySelector('.auto-download-notice');
                const originalDisplayBtn = downloadBtn.style.display;
                const originalDisplayNotice = notice.style.display;
                downloadBtn.style.display = 'none';
                notice.style.display = 'none';
                
                // PDF生成設定
                const options = {
                    margin: 10,
                    filename: 'vocabulary-test-${new Date().toISOString().slice(0, 10)}.pdf',
                    image: { type: 'jpeg', quality: 0.95 },
                    html2canvas: { 
                        scale: 2,
                        useCORS: true,
                        letterRendering: true,
                        allowTaint: true
                    }
                };
                
                // PDF生成とダウンロード
                const element = document.querySelector('.container');
                await html2pdf().set(options).from(element).save();
                
                // ボタンと通知を元に戻す
                downloadBtn.style.display = originalDisplayBtn;
                notice.style.display = originalDisplayNotice;
                notice.innerHTML = '✅ PDFダウンロードが完了しました！';
                notice.style.background = 'rgba(72, 187, 120, 0.2)';
                notice.style.borderColor = 'rgba(72, 187, 120, 0.3)';
                
            } catch (error) {
                console.error('PDF生成エラー:', error);
                const notice = document.querySelector('.auto-download-notice');
                notice.innerHTML = '❌ PDF生成中にエラーが発生しました';
                notice.style.background = 'rgba(245, 101, 101, 0.2)';
                notice.style.borderColor = 'rgba(245, 101, 101, 0.3)';
                
                // ボタンを元に戻す
                const downloadBtn = document.querySelector('.pdf-download-btn');
                if (downloadBtn) downloadBtn.style.display = originalDisplayBtn;
            }
        }
        
        // ページ読み込み完了時に自動PDF生成
        document.addEventListener('DOMContentLoaded', () => {
            console.log('単語テストページが読み込まれました（自動PDF化モード）');
            
            // すぐに自動でPDF生成を開始
            setTimeout(() => {
                downloadAsPDF();
            }, 100); // わずかな遅延でDOM安定化を待つ
        });
    </script>
</body>
</html>
        `;
    }
}

// アプリケーションの初期化
const app = new WordTestApp();

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    // 初期化完了
    console.log('単語テストアプリが初期化されました');
});
