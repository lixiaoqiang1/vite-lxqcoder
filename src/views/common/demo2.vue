<template>
  <div class="button-demo">
    <h1>Button 组件演示222</h1>
    
    <!-- <div class="demo-section">
      <h2>基础用法</h2>
      <byte-button type="primary">主要按钮</byte-button>
      <byte-button type="success">成功按钮</byte-button>
      <byte-button type="warning">警告按钮</byte-button>
      <byte-button type="danger">危险按钮</byte-button>
      <byte-button type="info">信息按钮</byte-button>
    </div> -->
    <!-- <li-button size="small" type="primary">按钮</li-button> -->
    <!-- 添加更多演示内容... -->
  </div>
</template>

<script>
export default {
  name: 'ButtonDemo',
}
</script>

<style scoped>
.button-demo {
  padding: 20px;
}

.demo-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.demo-section h2 {
  margin-bottom: 20px;
  color: #303133;
}

.demo-section .byte-button {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>