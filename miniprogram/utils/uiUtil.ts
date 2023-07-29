const showSimpleToast = (title: string): void => {
    wx.showToast({
        title: title,
        icon: 'none',
        duration: 2500
    });
}
const showErrorToast = (title: string): void => {
    wx.showToast({
        title: title,
        icon: 'error',
        duration: 2000
    });
}

const showLoading = (title?: string) => {
    wx.showLoading({
        title: title || '加载中',
        mask: true
    });
}
const hideLoading = () => {
    wx.hideLoading({}).catch(() => {});
}

export const uiUtils = {
    showSimpleToast,
    showErrorToast,
    showLoading,
    hideLoading,
};
