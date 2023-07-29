import { nimService } from '../../services/NimService'
import { uiUtils } from '../../utils/uiUtil'

interface Ball {
    /** 是否空球，用于占位 */
    empty: boolean;
    /** 是否禁用，表示上一轮选完的 */
    disabled: boolean;
    /** 是否选中，表示本轮选中的 */
    selected: boolean;
    /** 当前步数 */
    step: number;
}

interface BallGroup {
    balls: Ball[];
    remain: number;
    color: string;
}

const MAX_BALLS = 15
const buildBalls = (num: number): Ball[]  => {
    const balls = []
    for (let i = 0; i < MAX_BALLS; i++) {
        balls.push({
            empty: num <= i,
            disabled: false,
            selected: false,
            step: 1,
        })
    }
    return balls
}



const defBallsGroups = Object.freeze([{
    balls: buildBalls(5),
    remain: 5,
    color: 'rgb(230, 0, 14)',
}, {
    balls: buildBalls(8),
    remain: 8,
    color: 'rgb(252, 184, 9)',
}, {
    balls: buildBalls(15),
    remain: 15,
    color: 'rgb(20, 161, 230)',
}]) as BallGroup[]

Page({

    data: {
        step: 0,
        playState: 'prepare' as 'prepare' | 'ready' | 'going' | 'finish',
        ballsGroups: JSON.parse(JSON.stringify(defBallsGroups)) as BallGroup[],
    },

    onLoad() {

    },

    async doStart() {
        if (Object.keys(nimService.getGroupData()).length) {
            const modalRes = await wx.showModal({
                title: '提示',
                content: '确认要重新开始？',
            })
            if (!modalRes.confirm) {
                return
            }

        }

        nimService.cleanAllSelect()
        this.setData({
            ballsGroups: JSON.parse(JSON.stringify(defBallsGroups)),
            playState: 'prepare',
            step: 0,
        })

    },

    doFirstMe() {
        this.setData({
            playState: 'going',
        })
    },
    doFirstOther() {
        this.setData({
            playState: 'going',
        })
        this.optimalSelect()
    },



    doSelect(e: WechatMiniprogram.CustomEvent) {
        const playState = this.data.playState
        if (playState !== 'going') {
            if (playState == 'prepare') {
                uiUtils.showSimpleToast('请先选择谁先取球')
            }
            
            return
        }

        const dataset = e.currentTarget.dataset
        const groupIdx = parseInt(dataset.groupIdx)
        const ballIdx = parseInt(dataset.ballIdx)

        const ballsGroups = this.data.ballsGroups
        const balls = ballsGroups[groupIdx].balls
        const ball = balls[ballIdx]

        if (ball.disabled) {
            return
        }
        const selected = ball.selected
        if (!selected) {
            if (!nimService.addSelect(groupIdx, ballIdx)) {
                // 不能成功的添加选中的球
                uiUtils.showErrorToast('不能跨桶取球')
                return
            }
            ball.selected = true
        } else {
            nimService.rmSelect(groupIdx, ballIdx)
            ball.selected = false
        }


        this.setData({
            ballsGroups,
        })
    },
    doConfirm() {
        if (this.processSelect()) {
            this.optimalSelect()
        }
    },

    processSelect(): boolean {
        const groupIdx = nimService.getGroupIdx()
        const groupData = nimService.getGroupData()
        if (groupIdx === -1 || !Object.keys(groupData).length) {
            uiUtils.showErrorToast('请至少取一个球')
            return false
        }

        const step = this.data.step + 1

        const ballsGroups = this.data.ballsGroups
        const ballGroup = ballsGroups[groupIdx]
        for (const ballIdx in groupData) {
            const ball: Ball = ballGroup.balls[parseInt(ballIdx)]
            ball.disabled = true
            ball.step = step
        }
        // 剩余的
        ballGroup.remain -= Object.keys(groupData).length
        this.setData({
            step,
            ballsGroups,
        })
        
        nimService.cleanAllSelect()
        return true
    },

    optimalSelect() {
        const ballsGroups = this.data.ballsGroups
        
        const piles = ballsGroups.map(g => g.remain)

        const bestMove = nimService.findBestMove(piles)

        const groupIdx = bestMove.idx
        let num = bestMove.num

        const ballsGroup = ballsGroups[groupIdx]
        for (let i = 0; i < ballsGroup.balls.length; i++) {
            const ball = ballsGroup.balls[i]
            if (!ball.disabled && !ball.empty) {
                nimService.addSelect(bestMove.idx, i)
                num--
                if (num <= 0) {
                    break;
                }
            }
        }
        this.processSelect()

    },
    onShareAppMessage() {
        return {
            title: 'nim'
        }
    },





})