



class NimService {


    private groupIdx = -1 as number;
    private groupData = {} as Record<number, boolean>




    constructor() {
    }

    private isGroupEmpty(): boolean {
        return Object.keys(this.groupData).length == 0
    }

    cleanAllSelect() {
        this.groupIdx = -1 as number;
        this.groupData = {}
    }


    addSelect(groupIdx: number, ballIdx: number): boolean {
        if (this.groupIdx !== groupIdx && !this.isGroupEmpty()) {
            // 说明本次选取的球跨了多个区域，故禁止添加选中
            return false
        }
        this.groupIdx = groupIdx
        this.groupData[ballIdx] = true

        return true
    }

    rmSelect(groupIdx: number, ballIdx: number): boolean {
        if (this.groupIdx !== groupIdx) {
            return false
        }
        delete this.groupData[ballIdx]
        return true
    }

    getGroupIdx(): number {
        return this.groupIdx
    }

    getGroupData(): Record<number, boolean> {
        return (this.groupData)
    }


    xorSum(piles: number[]) {
        let xor = 0;
        for (const pile of piles) {
            xor ^= pile;
        }
        return xor;
    }
      
    findBestMove(piles: number[]): nim.BestMove {
        const xor = this.xorSum(piles);
      
        // 异或和为0，执行防守策略
        if (xor === 0) {
            // 随机取走一个球，以防止对手使用最优策略
            const randomPile = Math.floor(Math.random() * piles.length);
            const randomTake = Math.floor(Math.random() * piles[randomPile]) + 1;
            return {
                idx: randomPile, 
                num: randomTake
            }
        }
      
        // 异或和不为0，执行攻击策略
        for (let i = 0; i < piles.length; i++) {
            const take = xor ^ piles[i];
            if (take < piles[i]) {
                return {
                    idx: i, 
                    num: piles[i] - take
                }
            }
        }
        // never go here
        return {
            idx: 0,
            num: 1,
        }
    }
}


export const nimService = new NimService()