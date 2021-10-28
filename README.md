# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

运用天气API接口，APIKEY：6dfca6dd813c14b05c540dc20778caa4，7ab48f6d3bf24c4e8a4c04ab80905910
接口参数值：
area	string	上海市	地区
date	string	2020-03-23	日期
week	string	星期一	星期
weather	string	晴转多云	早晚天气变化
weatherimg	string	yun.png	天气图标
real	string	18℃	实时天气
lowest	string	6℃	最低温
highest	string	22℃	最高温
wind	string	东南风	风向
winddeg	string	121	风向360°角度
windspeed	string	7	风速，km/h
windsc	string	1-2级	风力
sunrise	string	06:10	日出时间
sunset	string	18:31	日落时间
moonrise	string	06:02	月升时间
moondown	string	17:22	月落时间
pcpn	string	0.0	降雨量
pop	string	1	降雨概率
uv_index	string	9	紫外线强度指数
vis	string	9	能见度，单位：公里
humidity	string	23	相对湿度
tips	string	天气暖和，适宜着单层......	生活指数提示