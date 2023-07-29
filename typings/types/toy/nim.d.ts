declare namespace nim {
    /** 取球的最优解 */
    interface BestMove {
        /** 从哪个里面取 */
        idx: number;
        /** 取多少个 */
        num: number;
    }
}