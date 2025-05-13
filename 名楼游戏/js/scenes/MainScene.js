class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        // 加载游戏资源
        this.load.spritesheet('player', 'assets/player.png', { 
            frameWidth: 32, 
            frameHeight: 48 
        });
        this.load.image('tengwangge_long', 'assets/tengwangge_long.png');
        this.load.spritesheet('guide', 'assets/guide.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        // 创建长背景，左上角为原点
        this.add.image(0, 0, 'tengwangge_long').setOrigin(0, 0);

        // 设置世界边界为背景图大小
        this.physics.world.setBounds(0, 0, 2400, 600);

        // 创建玩家角色，初始位置靠左
        this.player = this.physics.add.sprite(100, 500, 'player');
        this.player.setScale(3);
        this.player.setCollideWorldBounds(true);

        // 创建导游NPC，放在画面右侧某处
        this.guide = this.physics.add.sprite(2000, 500, 'guide');
        this.guide.setScale(3);
        this.guide.anims.play('guide_idle', true);
        
        // 设置动画
        this.createAnimations();

        // 设置键盘控制
        this.cursors = this.input.keyboard.createCursorKeys();

        // 设置对话触发区域
        this.setupInteractionZones();

        // 摄像机跟随玩家
        this.cameras.main.setBounds(0, 0, 2400, 600);
        this.cameras.main.startFollow(this.player);

        this.canInteract = false;

        // 创建三个任务点
        this.taskPoints = [
            { x: 300, y: 492, intro: '《百蝶百花图》\n这幅画是为了纪念滕派蝶画的鼻祖滕王李元婴而制作的。\n传其所画蛱蝶，或飞或立，姿态翩翩，栩栩如生。\n世人莫不争之如宝。\n故当时有"滕王蛱蝶江都马，一纸千金不当价"的赞誉。' },
            { x: 900, y: 492, intro: '唐伎乐图\n唐伎乐图是唐代壁画中的一个重要题材，\n描绘了唐代宫廷中的乐舞表演。\n画面中，乐师们手持乐器，\n翩翩起舞，场面热闹非凡。' },
            { x: 1400, y: 492, intro: '《时来风送滕王阁》\n据冯梦龙的《醒世恒言》名篇《马当神风送滕王阁》而作，\n描绘了王勃赴滕阁盛会写下《滕王阁序》的情景。' }
        ];
        this.taskZones = [];
        this.introDialogActive = false;
        this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.markerData = [];
        this.createTaskZones();

        this.collectedPieces = 0;
        this.totalPieces = 8; // 3个任务点+5个解谜
        this.pieceText = this.add.text(780, 20, `碎片：0/${this.totalPieces}`, {
            fontSize: '22px',
            fill: '#fff',
            fontFamily: 'Microsoft YaHei',
            backgroundColor: 'rgba(0,0,0,0.5)'
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(2000);
        this.addPiece = () => {
            this.collectedPieces++;
            this.pieceText.setText(`碎片：${this.collectedPieces}/${this.totalPieces}`);
            if (this.collectedPieces >= this.totalPieces) {
                this.scene.start('EndScene');
            }
        };
    }

    createAnimations() {
        // 向下走（第1行，帧0-3）
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
        // 向左走（第2行，帧4-7）
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
        // 向右走（第3行，帧8-11）
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
            frameRate: 8,
            repeat: -1
        });
        // 向上走（第4行，帧12-15）
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
            frameRate: 8,
            repeat: -1
        });
        // 静止帧（默认第1行第1帧）
        this.anims.create({
            key: 'idle',
            frames: [ { key: 'player', frame: 0 } ],
            frameRate: 1
        });
        // 导游静止（第1行第1帧）
        this.anims.create({
            key: 'guide_idle',
            frames: [ { key: 'guide', frame: 0 } ],
            frameRate: 1
        });
        // 导游向下走（第1行，帧0-3）
        this.anims.create({
            key: 'guide_down',
            frames: this.anims.generateFrameNumbers('guide', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    }

    setupInteractionZones() {
        // 创建与导游的交互区域，放在导游附近
        this.interactionZone = this.add.zone(2000, 500, 100, 100);
        this.physics.add.existing(this.interactionZone, true);

        // 进入交互区
        this.physics.add.overlap(this.player, this.interactionZone, () => {
            this.canInteract = true;
        }, null, this);
    }

    createTaskZones() {
        this.taskZones = [];
        this.taskPoints.forEach((point, idx) => {
            // 添加任务点标记（如红色圆圈）
            const marker = this.add.circle(point.x, point.y - 40, 20, 0xff3333);
            marker.setStrokeStyle(4, 0xffffff);
            marker.setDepth(1000);
            // 提示文字
            const tip = this.add.text(point.x, point.y - 80, '按E键查看简介', {
                fontSize: '18px',
                fill: '#fff',
                fontFamily: 'Microsoft YaHei',
                backgroundColor: 'rgba(0,0,0,0.5)'
            }).setOrigin(0.5);
            tip.setDepth(1001);
            // 创建zone用于overlap检测
            const zone = this.add.zone(point.x, point.y, 120, 160);
            this.physics.add.existing(zone, true);
            this.taskZones.push({ zone, idx });
        });
    }

    update() {
        // 处理玩家移动
        const speed = 160;
        let moving = false;
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.setVelocityY(0);
            this.player.anims.play('left', true);
            moving = true;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.setVelocityY(0);
            this.player.anims.play('right', true);
            moving = true;
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
            this.player.setVelocityX(0);
            this.player.anims.play('up', true);
            moving = true;
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
            this.player.setVelocityX(0);
            this.player.anims.play('down', true);
            moving = true;
        } else {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.player.anims.play('idle', true);
        }

        // 检查是否离开交互区
        if (this.canInteract) {
            const playerBounds = this.player.getBounds();
            const zoneBounds = this.interactionZone.getBounds();
            if (!Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, zoneBounds)) {
                this.canInteract = false;
            }
        }

        if (this.canInteract && Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.scene.launch('DialogScene');
            this.canInteract = false; // 防止多次触发
        }

        // 最原始的E键触发方法：overlap检测+E键
        if (!this.introDialogActive) {
            this.taskZones.forEach(({ zone, idx }) => {
                if (this.physics.overlap(this.player, zone)) {
                    if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
                        this.introDialogActive = true;
                        this.scene.launch('IntroDialogScene', { 
                            text: this.taskPoints[idx].intro
                        });
                    }
                }
            });
        }
    }
} 