module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // uglify: {
        //     options: {
        //         banner: '/* <%= pkg.name %> <%= pkg.version %> \n build time: <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> */'
        //     },
        //     dist: {
        //         files: {
        //             'build/<%= pkg.name %>.<%= pkg.version %>.min.js': ['src/*.js']
        //         }
        //     }
        // },        
        min: {
            dist: {
                src: ['build/<%= pkg.name %>.<%= pkg.version %>.js'],
                dest: 'build/<%= pkg.name %>.<%= pkg.version %>.min.js'
            }
        },        
        clean: {
            build: {
                src: ['build/']
            },
            grover: {
                src: ['grover.json']
            },
            svn:{
                src: ['build/' , 'grover.json']
            }
        },
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                version: '<%= pkg.vesion%>',
                options: {
                    paths: 'build/',
                    outdir: 'build/docs'
                }
            }
        },
        zip: {
            framework:{
                cwd: 'build/',
                src: ['build/*.js' , 'build/docs/**'],
                dest: 'build/<%= pkg.name %>.<%= pkg.version %>.zip'
            }
        },
        groverData: {},
        shell:{
        	makeBuild:{
        		command: 'mkdir build'
        	},
            grover:{
                command : 'grover test/UnitTest/index.html -o grover.json --json',
                options:{
                    stdout: true ,
                    callback: function(err , stdout , stderr , cb){
                        var fs = require('fs') ,
                            data;
                        data = JSON.parse(fs.readFileSync('grover.json'));
                        groverData = data;
                        console.log(stdout);
                        //console.log(grunt.config.data.notify);
                        grunt.config.data.notify.unitTestFinished.options.test = grunt.file.readJSON('grover.json');
                        //grunt.config.notify.unitTestFail.options.test = grunt.file.readJSON('grover.json');
                        //cb(!data.failed , data.errors);
                        cb();
                    }
                }
            }
        },
        notify:{
            startUnitTest:{
                options:{
                    title: "Unit Test",
                    message: "Start unit test"
                }
            },
            unitTestFinished:{
                options:{
                    test: {},
                    title: "Unit Test",
                    message: "Passed:<%= notify.unitTestFinished.options.test.passed/2 %>, Faild:<%= notify.unitTestFinished.options.test.failed/2 %> , Errors:<%= notify.unitTestFinished.options.test.errors/2 %>"
                }
            },
            buildSucceed:{
                options:{
                    title: "Build Succeed",
                    message: "Html5 Game Framework <%= pkg.version %> build succeed"
                }
            }
        },
        watch:{
            scripts:{
                files:['src/*.js'],
                tasks:[ 'clean:grover' , 'notify:startUnitTest' ,  'shell:grover' , 'clean:grover' ,  'notify:unitTestFinished'],
                options: {
                    spawn:false,
                    interrupt:true
                }
            }
        },
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: 
                [
                    'src/Util.js',
                    'src/core.js',
                    'src/DebugInfo.js',
                    'src/FpsAnalysis.js',
                    'src/Point.js',
                    'src/GameObject.js',
                    'src/Sprite.js',
                    'src/animationSprite.js',
                    'src/Scene.js',                    
                    'src/ResourceManager.js',
                    'src/level.js',
                    'src/Game.js',
                    'src/KeyBoardManager.js',
                    'src/MouseManager.js',
                    'src/TouchManager.js',
                    'src/gameMainMenu.js',
                    'src/Audio.js',
                    'src/Box2dWeb-2.1.a.3.js',
                    'src/Box2D.js',
                ],
                dest: 'build/<%= pkg.name %>.<%= pkg.version %>.js',
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-watch');    
    // for windows download it and install ->  http://snarl.fullphat.net/
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-yui-compressor');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['clean:build' , 'shell:makeBuild' , 'concat' , 'yuidoc' ,'min' , 'zip' , 'notify:buildSucceed'] );
    grunt.registerTask('svn' , ['clean:svn']);
};
