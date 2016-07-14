## TIL (Today I Learn)

#### 1. markdown 
##### 간단한 문법
###### **굵게** : 
    **굵게**, __굵게__
###### *기울임* : 
    *기울임*, _기울임_
###### [링크](http://googole.com/) 또는 <http://googole.com/> : 
    - [텍스트](URL), <http://googole.com/>, 새창으로는 지원 안됨 
###### 이메일 주소 링크 : <tmdgh6789@gmail.com> 
    <tmdgh6789@gmail.com>
###### 이미지 : ![대체 텍스트](http://www.remotesensing.gov.my/portalarsm/images/tab/G_is_For_Google_New_Logo_Thumb.png)
    - ![대체텍스트](URL)
> ###### 블럭인용 : 
    >텍스트

######목록 : 
    - 또는 1. 로 시작
    

###### 헤더 : 
    # H1, ## H2, ### h3, #### H4, ##### H5, ###### H6
###### 수평선 : 
---
    ---, ***
***
###### 코드 : 
>
    `
        /*코드*/
        #include<stdio.h>
        int main(int argc, char * argv[])
        {
          printf("Hello World!\n");
          return 0;
        } 
    `
    `코드`, ``코드``, ```코드```

```c
#include<stdio.h>
int main(int argc, char * argv[])
{
    printf("Hello World!\n");
    return 0;
} 
```

```javascript
alert("Hello World!\n");
```


###### 줄바꿈 : 
    두 번 이상 줄바꿈 하면 강제로 적용
###### 취소선 : ~~텍스트~~ 
    ~~텍스트~~
###### 주석달기  : 주석 달 문장[^1]
[^1] : 주석 문장

    주석을 달 문장 끝에 [^1], 주석 문장 처음에 [^1]: 입력

    
    