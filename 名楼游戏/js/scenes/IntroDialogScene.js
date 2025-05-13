class IntroDialogScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroDialogScene' });
    }

    init(data) {
        this.introText = data.text || '';
    }

    create() {
        // 半透明背景
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
        
        // 简介对话框
        this.add.rectangle(400, 450, 700, 200, 0xffffff, 0.9)
            .setStrokeStyle(2, 0x000000);
        
        // 简介文本
        this.add.text(120, 420, this.introText, {
            fontSize: '22px',
            fill: '#000',
            fontFamily: 'Microsoft YaHei',
            wordWrap: { width: 560 }
        });

        // 点击关闭
        this.input.once('pointerdown', () => {
            this.scene.get('MainScene').addPiece();
            this.scene.get('MainScene').introDialogActive = false;
            this.scene.stop();
        });
    }
} 