class WordTestApp {
    constructor() {
        this.words = [];
        this.testMode = 'en-jp'; // 'en-jp' or 'jp-en'
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
        
        // 日本語対応のための設定
        doc.setFont('helvetica');
        
        // タイトル
        doc.setFontSize(18);
        const testModeText = this.testMode === 'en-jp' ? 'English to Japanese' : 'Japanese to English';
        doc.text(`Word Test / 単語テスト (${testModeText})`, 20, 20);
        
        // 作成日時と設定情報
        const now = new Date();
        const dateString = now.toLocaleDateString('ja-JP');
        doc.setFontSize(10);
        doc.text(`Created: ${dateString}`, 20, 30);
        doc.text(`Questions: ${selectedWords.length} / Range: ${rangeStart}-${rangeEnd}`, 20, 38);
        
        // 問題セクション
        doc.setFontSize(14);
        doc.text('Questions:', 20, 50);
        
        let questionData;
        if (this.testMode === 'en-jp') {
            questionData = selectedWords.map((wordObj, index) => [
                `${index + 1}`,
                wordObj.word,
                '→',
                '_______________'
            ]);
        } else {
            questionData = selectedWords.map((wordObj, index) => [
                `${index + 1}`,
                wordObj.meaning,
                '→',
                '_______________'
            ]);
        }
        
        // 表形式で問題を表示
        const headers = this.testMode === 'en-jp' ? 
            [['No.', 'Word', '', 'Meaning']] : 
            [['No.', 'Meaning', '', 'Word']];
        
        doc.autoTable({
            head: headers,
            body: questionData,
            startY: 55,
            theme: 'grid',
            styles: { fontSize: 12, cellPadding: 5 },
            headStyles: { fillColor: [102, 126, 234] },
            columnStyles: {
                0: { cellWidth: 15 },
                1: { cellWidth: 50 },
                2: { cellWidth: 15 },
                3: { cellWidth: 80 }
            }
        });
        
        // 解答セクション
        doc.addPage();
        doc.setFontSize(14);
        doc.text('Answers:', 20, 20);
        
        let answerData;
        if (this.testMode === 'en-jp') {
            answerData = selectedWords.map((wordObj, index) => [
                `${index + 1}`,
                wordObj.word,
                '→',
                wordObj.meaning
            ]);
        } else {
            answerData = selectedWords.map((wordObj, index) => [
                `${index + 1}`,
                wordObj.meaning,
                '→',
                wordObj.word
            ]);
        }
        
        doc.autoTable({
            head: headers,
            body: answerData,
            startY: 25,
            theme: 'grid',
            styles: { fontSize: 12, cellPadding: 5 },
            headStyles: { fillColor: [102, 126, 234] },
            columnStyles: {
                0: { cellWidth: 15 },
                1: { cellWidth: 50 },
                2: { cellWidth: 15 },
                3: { cellWidth: 80 }
            }
        });
        
        // PDFを保存
        const modeText = this.testMode === 'en-jp' ? 'EN-JP' : 'JP-EN';
        const fileName = `word_test_${modeText}_${selectedWords.length}Q_${dateString.replace(/\//g, '-')}.pdf`;
        doc.save(fileName);
        
        alert(`PDFファイル「${fileName}」を保存しました。\n出題数: ${selectedWords.length}問\n出題範囲: ${rangeStart}-${rangeEnd}番目`);
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
}

// アプリケーションの初期化
const app = new WordTestApp();

// ページ読み込み時にセットアップ画面を表示
document.addEventListener('DOMContentLoaded', () => {
    app.showSetupScreen();
});
