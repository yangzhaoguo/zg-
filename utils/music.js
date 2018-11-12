//获取应用实例
const app = getApp();

  function onShow () {
    let that = this;
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    console.log(currPage.data.audioIndex);
    wx.setStorageSync('audioIndex', parseInt(currPage.data.audioIndex, 10));
    that.play();
  }

  function onLoad (options) {
    let that = this;
    //获取播放的音频列表
    let rankList = app.globalData.songRankList;  //获取播放的音频列表
    let newSongList = app.globalData.newSongList;
    let sign = app.globalData.sign;
    console.log(rankList);
    console.log(options.pic);
    console.log("播放的音频列表");
    that.setData({
      songRankList: rankList,
      newSongList: newSongList,
      sign: sign,
      VideoPic: options.pic,
      video_id: options.course_id,
      ntype: options.type
    })

    //wx.setStorageSync('audioIndex', rankList.cur_count-1);
    //  获取本地存储在audioIndex的值
    var audioIndexStorage = wx.getStorageSync('audioIndex');
    console.log("音频的Index..." + parseInt(audioIndexStorage));
    console.log(audioIndexStorage);
    that.setData({
      audioIndex: audioIndexStorage
    });

    that.play();
  }

  //音乐播放进度条
  function bindSliderchange (e) {
    // clearInterval(this.data.timer)
    let value = e.detail.value
    let that = this
    console.log(e.detail.value)
    //获取后台音乐播放的状态
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        console.log(123);
        console.log(res)
        let { status, duration } = res
        if (status === 1 || status === 0) {
          that.setData({
            sliderValue: value
          });
          //控制音乐播放的进度
          wx.seekBackgroundAudio({
            position: value * duration / 100,
          });
        }
      }
    })
  }

  //上一首
  function bindPrevSong () {
    if (this.data.sign == 0) {
      wx.showToast({
        title: '暂无更多音频',
        image: '../../images/warning.png',
        duration: 2000
      })
    } else {
      console.log('上一节...')
      let length = this.data.songRankList.length;
      let audioIndexPrev = this.data.audioIndex;
      console.log(length);
      console.log(audioIndexPrev);
      let audioIndexNow = audioIndexPrev;
      if (audioIndexPrev != 0) {
        audioIndexNow = audioIndexPrev - 1;
      } else {
        audioIndexNow = 0;
      }
      this.setData({
        audioIndex: audioIndexNow,
        sliderValue: 0,
        currentTime: 0,
        totalTime: 0,
      })
      let that = this
      setTimeout(() => {
        if (that.data.playStatus === false) {
          that.play();
        }
      }, 1000);
      //设置audioIndex 为当前的index
      wx.setStorageSync('audioIndex', audioIndexNow);
    }
  }
  //下一首
  function bindNextSong () {
    if (this.data.sign == 0) {
      wx.showToast({
        title: '暂无更多音频',
        image: '../../images/warning.png',
        duration: 2000
      })
    } else {
      console.log('下一节...')
      let length = this.data.songRankList.length;
      let audioIndexPrev = this.data.audioIndex;
      console.log(length);
      console.log(audioIndexPrev);
      let audioIndexNow = audioIndexPrev;
      if (audioIndexPrev === length - 1) {
        audioIndexNow = 0;
      } else {
        audioIndexNow = audioIndexPrev + 1;
      }
      this.setData({
        audioIndex: audioIndexNow,
        sliderValue: 0,
        currentTime: 0,
        totalTime: 0,
      })
      let that = this
      setTimeout(() => {
        if (that.data.playStatus === false) {
          that.play();
        }
      }, 1000)
      wx.setStorageSync('audioIndex', audioIndexNow);
    }
  }
  //播放 暂停
  function bindPlaySong () {
    console.log('播放/暂停音乐...');
    console.log(this.data.playStatus);
    if (this.data.playStatus === true) {
      this.play();
      this.setData({
        playStatus: false
      });
    } else {
      wx.pauseBackgroundAudio();
      this.setData({
        playStatus: true
      });
    }
  }
  //播放音乐函数
  function play() {
    let that = this;
    let { songRankList } = that.data
    console.log("播放时的数据...")
    console.log(that.data);
    let songId, songPicId, standard_url, songPic, songName, singer;
    if (that.data.sign == 0) {
      console.log(1);
      let newSong = that.data.newSongList;
      standard_url = newSong.standard_url;
      // songPic = newSong.albumpic_small;
      songName = newSong.title;
      singer = newSong.title;
    } else {
      if ("data" in songRankList) {
        console.log(2);
        console.log(songRankList);
        let rankFormatOne = songRankList[that.data.audioIndex];
        songId = rankFormatOne.id;
        songPicId = rankFormatOne.id;
        songName = rankFormatOne.title;
        standard_url = rankFormatOne.standard_url;
        songPic = rankFormatTwo.img
      } else {
        console.log(4);
        console.log(songRankList);
        let rankFormatTwo = songRankList[that.data.audioIndex];
        songId = rankFormatTwo.id;
        songPicId = rankFormatTwo.id;
        songName = rankFormatTwo.title;
        standard_url = rankFormatTwo.standard_url
        songPic = rankFormatTwo.img
      }

    }
    that.setData({
      songData: {
        songId: songId,
        standard_url: standard_url,
        songPic: songPic,
        songName: songName,
      },
    })

    wx.playBackgroundAudio({
      dataUrl: standard_url,
      title: songName,
      coverImgUrl: songPic
    })
    let timer = setInterval(function () {
      that.setDuration(that)
    }, 1000)
    that.setData({ timer: timer })
  }
  //音乐 时间轴
  function setDuration(that) {
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        let { status, duration, currentPosition } = res
        if (status === 1 || status === 0) {
          that.setData({
            currentTime: that.stotime(currentPosition),
            totalTime: that.stotime(duration),
            sliderValue: Math.floor(currentPosition * 100 / duration),
          })
        }
      }
    })
  }
  //时间转换
  function stotime (ss) {
    let t = '';
    var s = new Date(ss);
    if (s > -1) {
      // let hour = Math.floor(s / 3600);
      let min = Math.floor(s / 60) % 60;
      let sec = s % 60;
      // if (hour < 10) {
      //   t = '0' + hour + ":";
      // } else {
      //   t = hour + ":";
      // }

      if (min < 10) { t += "0"; }
      t += min + ":";
      if (sec < 10) { t += "0"; }
      t += sec;
    }
    return t;
  }
//最下面一定要加上你自定义的方法（作用：将模块接口暴露出来），否则会报错：util.trim is not a function;
module.exports = {
  stotime: stotime,
  musicPlay:play
}