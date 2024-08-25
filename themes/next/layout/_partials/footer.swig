{%- if theme.footer.beian.enable %}
  <div class="beian">
    {{- next_url('https://beian.miit.gov.cn', theme.footer.beian.icp + ' ') }}
    {%- if theme.footer.beian.gongan_icon_url %}
      <img src="{{ url_for(theme.footer.beian.gongan_icon_url) }}" style="display: inline-block;">
    {%- endif %}
    {%- if theme.footer.beian.gongan_id and theme.footer.beian.gongan_num %}
      {{- next_url('http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=' + theme.footer.beian.gongan_id, theme.footer.beian.gongan_num + ' ') }}
    {%- endif %}
  </div>
{%- endif %}

<div class="copyright">
  {% set copyright_year = date(null, 'YYYY') %}
  &copy; {% if theme.footer.since and theme.footer.since != copyright_year %}{{ theme.footer.since }} – {% endif %}
  <span itemprop="copyrightYear">{{ copyright_year }}</span>
  <span class="with-love">
    <i class="{{ theme.footer.icon.name }}"></i>
  </span>
  <span class="author" itemprop="copyrightHolder">{{ theme.footer.copyright or author }}</span>

<!--修改-->

<!--添加网站运行时间 -->
<script type="text/javascript">
    function show_site_runtime(){
    window.setTimeout("show_site_runtime()",1000); // 每秒运行一次函数
    X=new Date("10/23/2021 00:00:00"); //在这里修改你的建站时间
    Y=new Date();
    T=(Y.getTime()-X.getTime()); // 获取当前时间与指定时间之间的时间间隔（ms）    
    i=24*60*60*1000;
    d=T/i;
    D=Math.floor(d); // 计算天数并向下取整
    h=(d-D)*24;
    H=Math.floor(h); // 计算剩余不足一天的小时数并向下取整
    m=(h-H)*60;
    M=Math.floor(m); // 计算剩余不足一小时的分钟数并向下取整
    s=(m-M)*60
    S=Math.floor(s); // 计算剩余不足一分钟的秒数并向下取整
    site_runtime.innerHTML= D + " 天 " + H + " 小时 " + M + " 分 " + S + " 秒 "
    }
    show_site_runtime();
</script>
<p>>w< 本博客已诞生<span id="site_runtime" style="color: #24a0f0;"></span>>w<</p>
<!--添加网站运行时间 -->



<!--修改-->

{%- if theme.footer.powered %}
  <div class="powered-by">
    {%- set next_site = 'https://theme-next.org' %}
    {%- if theme.scheme !== 'Gemini' %}
      {%- set next_site = 'https://' + theme.scheme | lower + '.theme-next.org' %}
    {%- endif %}
    {{- __('footer.powered', next_url('https://hexo.io', 'Hexo', {class: 'theme-link'}) + ' & ' + next_url(next_site, 'NexT.' + theme.scheme, {class: 'theme-link'})) }}
  </div>
{%- endif %}

{%- if theme.add_this_id %}
  <div class="addthis_inline_share_toolbox">
    <script src="//s7.addthis.com/js/300/addthis_widget.js#pubid={{ theme.add_this_id }}" async="async"></script>
  </div>
{%- endif %}



{{- next_inject('footer') }}




</div>



