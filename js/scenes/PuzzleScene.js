class PuzzleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PuzzleScene' });
        this.questions = [
            {
                question: '《滕王阁序》的作者是谁？',
                options: ['王勃', '李白', '杜甫', '白居易'],
                answer: '王勃'
            },
            {
                question: '滕王阁位于哪座城市？',
                options: ['南昌', '杭州', '南京', '苏州'],
                answer: '南昌'
            },
            {
                question: '滕王阁最初建于哪个朝代？',
                options: ['唐朝', '宋朝', '明朝', '清朝'],
                answer: '唐朝'
            },
            {
                question: '“落霞与孤鹜齐飞”出自哪篇文章？',
                options: ['滕王阁序', '岳阳楼记', '赤壁赋', '兰亭集序'],
                answer: '滕王阁序'
            },
            {
                question: '滕王阁因谁而得名？',
                options: ['李元婴', '李白', '王勃', '杜甫'],
                answer: '李元婴'
            }
        ];
        this.current = 0;
    }

    create() {
        this.showQuestion();
    }

    showQuestion() {
        this.cameras.main.setBackgroundColor('#000000');
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
        this.add.text(400, 100, '滕王阁知识问答', {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Microsoft YaHei'
        }).setOrigin(0.5);

        const q = this.questions[this.current];
        this.add.text(400, 200, q.question, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Microsoft YaHei'
        }).setOrigin(0.5);

        q.options.forEach((option, index) => {
            const button = this.add.text(400, 300 + index * 60, option, {
                fontSize: '20px',
                fill: '#ffffff',
                fontFamily: 'Microsoft YaHei',
                backgroundColor: '#4a90e2',
                padding: { x: 20, y: 10 }
            })
                .setOrigin(0.5)
                .setInteractive();

            button.on('pointerdown', () => {
                if (option === q.answer) {
                    this.scene.get('MainScene').addPiece();
                    this.showResult(true);
                } else {
                    this.showResult(false);
                }
            });
        });
    }

    showResult(correct) {
        const resultText = correct ?
            '回答正确！' :
            '回答错误，请再试一次！';

        this.add.text(400, 500, resultText, {
            fontSize: '20px',
            fill: correct ? '#00ff00' : '#ff0000',
            fontFamily: 'Microsoft YaHei'
        }).setOrigin(0.5);

        if (correct) {
            this.current++;
            if (this.current < this.questions.length) {
                this.time.delayedCall(1500, () => {
                    this.scene.restart({ current: this.current });
                });
            } else {
                this.time.delayedCall(2000, () => {
                    this.scene.resume('MainScene');
                    this.scene.stop();
                });
            }
        }
    }

    init(data) {
        this.current = data && data.current ? data.current : 0;
    }
} 