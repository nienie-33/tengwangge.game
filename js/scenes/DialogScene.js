class DialogScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DialogScene' });
        this.dialogIndex = 0;
        this.dialogs = [
            {
                speaker: '导游',
                text: '欢迎来到滕王阁！\n这座始建于唐代的著名建筑，因王勃的《滕王阁序》而闻名于世。'
            },
            {
                speaker: '导游',
                text: '滕王阁始建于唐永徽四年（653年），\n由唐高祖李渊之子李元婴任洪州都督时创建。'
            },
            {
                speaker: '导游',
                text: '你知道吗？滕王阁历经29次重建，\n现在的建筑是1989年重建的。'
            },
            {
                speaker: '导游',
                text: '要不要来玩个解谜游戏？\n通过解谜，你可以了解更多关于滕王阁的历史。'
            }
        ];
    }

    create() {
        // 创建半透明背景
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);

        // 创建对话框
        this.dialogBox = this.add.rectangle(400, 450, 700, 200, 0xffffff, 0.9);
        this.dialogBox.setStrokeStyle(2, 0x000000);

        // 创建文本
        this.speakerText = this.add.text(100, 380, '', {
            fontSize: '24px',
            fill: '#000000',
            fontFamily: 'Microsoft YaHei'
        });

        this.dialogText = this.add.text(100, 420, '', {
            fontSize: '20px',
            fill: '#000000',
            fontFamily: 'Microsoft YaHei',
            wordWrap: { width: 600 }
        });

        // 显示第一段对话
        this.showDialog();

        // 设置点击事件
        this.input.on('pointerdown', () => {
            this.dialogIndex++;
            if (this.dialogIndex < this.dialogs.length) {
                this.showDialog();
            } else {
                this.scene.resume('MainScene');
                this.scene.stop();
                // 对话结束后自动切换到解谜场景
                this.scene.launch('PuzzleScene');
            }
        });
    }

    showDialog() {
        const currentDialog = this.dialogs[this.dialogIndex];
        this.speakerText.setText(currentDialog.speaker + '：');
        this.dialogText.setText(currentDialog.text);
    }
} 