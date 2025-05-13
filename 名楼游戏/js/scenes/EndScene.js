class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' });
    }
    preload() {
        this.load.audio('end_bgm', 'assets/end_bgm.mp3'); // 请将音乐文件放到assets目录
    }
    create() {
        // 播放背景音乐
        this.sound.add('end_bgm', { loop: false }).play();
        // 显示标语
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
        this.add.text(400, 250, '恭喜你集齐所有《滕王阁序》碎片！', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Microsoft YaHei'
        }).setOrigin(0.5);
        this.add.text(400, 350, '游戏结束，感谢游玩！', {
            fontSize: '28px',
            fill: '#fff',
            fontFamily: 'Microsoft YaHei'
        }).setOrigin(0.5);
    }
} 