/**
 * ��ָ�����ļ����Ƶ�ָ����Ŀ¼����
 *
 */
module.exports = function(grunt){
    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json')
    });

    grunt.registerTask('after',function(){
        var originalContent = grunt.file.read('./test.js','utf8');
        var comment = '//projectName <%=pkg.name%>,author <%=pkg.author%>'+grunt.util.normalizelf('\n');
        //mvc�����ʵ����config��������˶���
        comment = grunt.template.process(comment);
        grunt.file.write('test2.js',comment+originalContent);
    });

}