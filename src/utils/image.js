import { createCanvas, loadImage, registerFont } from 'canvas'
import fs from 'fs'
import path from 'path'

export async function createVerticalImage({
    width,       
    height,      
    coverUrl,    
    title,       
    artist,      
    comment,     
    sender,
    receiver,
    recomsId }){
    registerFont('src/shares/Pretendard-Regular.otf', { family: 'Pretendard' });
    const scale = 2;  // 2배 해상도로 그립니다
    // 1) 캔버스 생성 & 전체 배경 회색 채우기
    const canvas = createCanvas(width * scale, height * scale);
    const ctx    = canvas.getContext('2d')
    ctx.scale(scale, scale);
    ctx.fillStyle = '#333'
    ctx.fillRect(0, 0, width, height)

    // 2) 앨범 이미지 로드 및 크기 계산
    const img     = await loadImage(coverUrl)
    const coverW  = width
    const coverH  = img.height * (coverW / img.width)

    // 3) 클리핑 경로 설정 (사각 + 완만한 타원 상단 절반)
    const rx = coverW / 2           // 타원 수평 반지름 = 캔버스 절반폭
    const ry = 120                  // 타원 수직 반지름 (곡선 깊이)
    const cx = coverW / 2
    const cy = 70                 // 타원이 접하는 지점이 coverH

    ctx.save()
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(coverW, 0)
    ctx.lineTo(coverW, cy)
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI, false)
    ctx.lineTo(0, cy)
    ctx.closePath()
    ctx.clip()

    // 4) 클립된 영역에만 앨범 이미지 그리기
    ctx.drawImage(img, 0, 0, coverW, coverH)
    ctx.restore()

    // 5) 앨범 이미지 상단 중앙에 반투명 원 그리기
    ctx.save()
    ctx.globalAlpha = 0.4
    const circleRadius = 70         // 큰 원 반지름
    const circleX = coverW / 2  // 중앙 X
    const circleY = circleRadius - 20 // 위쪽 마진
    ctx.beginPath()
    ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2)
    ctx.fillStyle = '#000'
    ctx.fill()
    ctx.restore()

    // 5b) 반투명 원 위에 더 작은 검정 원 그리기
    ctx.beginPath()
    const innerCircleRadius = 36 // 작은 원 반지름
    ctx.arc(circleX, circleY, innerCircleRadius, 0, Math.PI * 2)
    ctx.fillStyle = '#191919'
    ctx.fill()

    // 1) 폰트·정렬 설정
    ctx.font      = '10px Pretendard';
    ctx.textAlign = 'left';  // left align으로 바꿔서 직접 x 좌표 계산

    // 2) 텍스트 전체 너비 구하기
    const fullText    = `To. ${receiver}`;
    const fullWidth   = ctx.measureText(fullText).width;

    // 3) 캔버스 가운데 정렬을 위해 시작 X 계산
    const startX = (width - fullWidth) / 2;
    const y      = 220;

    // 4) “To. ” 부분 회색으로
    const prefix      = 'To. ';
    const prefixWidth = ctx.measureText(prefix).width;
    ctx.fillStyle     = '#adadad';
    ctx.fillText(prefix, startX, y);

    // 5) receiver 부분 흰색으로
    ctx.fillStyle = '#ffffff';
    ctx.fillText(receiver, startX + prefixWidth, y);

    // 6) 텍스트를 회색 배경 위에 그리기
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'

    ctx.font = '14px Pretendard'
    const titleEndY = wrapText(ctx, title, width / 2, 250, width * 0.8, 15)

    ctx.fillStyle     = '#adadad';
    ctx.font = '12px Pretendard'
    ctx.fillText(artist, width / 2, titleEndY + 20)

    ctx.fillStyle = '#ffffff'
    ctx.font = '11px Pretendard'
    const commentEndY = wrapText(ctx, comment, width / 2, titleEndY + 70 , width * 0.8, 15)

    // From. 보내는 사람 (회색 + 흰색)
    ctx.font      = '10px Pretendard';
    ctx.textAlign = 'left';

    const fromPrefix      = 'From. ';
    const fromFullText    = fromPrefix + sender;
    const fromFullWidth   = ctx.measureText(fromFullText).width;
    const fromStartX      = (width - fromFullWidth) / 2;
    const fromY           = 370;

    const fromPrefixWidth = ctx.measureText(fromPrefix).width;

    // 회색으로 접두사
    ctx.fillStyle = '#adadad';
    ctx.fillText(fromPrefix, fromStartX, fromY);

    // 흰색으로 이름
    ctx.fillStyle = '#ffffff';
    ctx.fillText(sender, fromStartX + fromPrefixWidth, fromY);

    // 7) 결과물 저장
    const outPath = path.resolve(`src/shares/${recomsId}.png`)
    await fs.promises.mkdir(path.dirname(outPath), { recursive: true })
    const out = fs.createWriteStream(outPath)
    canvas.createPNGStream().pipe(out)
    await new Promise((res, rej) => {
      out.on('finish', res)
      out.on('error', rej)
    })

    return outPath
}

// 줄바꿈 헬퍼
function wrapText(ctx, text = '', x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let curY = y;
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const { width: testWidth } = ctx.measureText(testLine);
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, curY);
            line = words[n] + ' ';
            curY += lineHeight;
        } else {
          line = testLine;
        }
    }
    ctx.fillText(line, x, curY);
    return curY;
}