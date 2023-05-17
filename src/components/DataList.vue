<script setup>
import { reactive, ref, onBeforeMount, toRef, computed } from "vue";

import { usePagination } from "vue-request";
import { RotateLeftOutlined } from "@ant-design/icons-vue";
import axios from "axios";

const props = defineProps({
  columns: {
    type: Array,
    default: () => {
      return [];
    },
    required: true,
  },
  rowKey: {
    type: String,
    default: "record => record.id",
  },
});

const userRequest = (params) => {
  return axios.get("https://randomuser.me/api?noinfo", {
    params,
  });
};

// args 是第一个参数， 对应下面 defaultParams 数组值的第一个 对象元素

const {
  data,
  loading,
  error,
  params,
  run,
  runAsync,
  current,
  pageSize,
  total,
  // changeCurrent,
  // changePageSize,
  changePagination,
} = usePagination(
  // useRequest 接收了一个 service 异步请求函数
  // 这里的service 对应的就是 DataListRequest
  // usePagination 和 useRequest 本质上没有区别，仅仅在返回结果中追加了分页数据
  userRequest,

  {
    defaultParams: [
      {
        result: 10,
        page: 1,
      },
    ],
    errorRetryCount: 3,
    pagination: {
      // 读取服务端返回的数据
      currentKey: "page", // request 的参数值
      pageSizeKey: "results",
      totalKey: "results", // 响应数据data 中的key
    },
  }
);

const dataSource = computed(() => data);
// const dataSource = ref([])

const pagination = computed(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,
  defaultPageSize: 10,
  pageSizeOptions: ["10", "20", "50", "100"],
  showSizeChanger: true,
  showQuickJumper: true,
}));

const handleTableChange = async (
  pagination_new,
  filters,
  sorter,
  { currentDataSource }
) => {
  console.log("pagination_new", pagination_new);

  run({
    results: pagination_new.pageSize,
    page: pagination_new?.current,
  });

  // changePagination(pagination_new.current, pagination_new.pageSize)

  // current.value = pagination_new.current
  // pageSize.value = pagination_new.pageSize

  // runAsync(
  //     await DataListRequest(
  //         {
  //             params: {
  //                 pageSize: pagination_new.pageSize,
  //                 current: pagination_new.current
  //             }
  //         },
  //         'game',
  //         'post'
  //     ).then((res) => {
  //         console.log('run res', res)
  //         data.value = res
  //     })
  // )
};

onBeforeMount(() => {
  console.log("Mount data", data);
  console.log("Mount params", params);
  console.log("Mount dataSource", dataSource);
  console.log("Mount current", current);
  console.log("Mount pageSize", pageSize);
  console.log("Mount total", total);
});
</script>

<template>
  <div class="mt-8 mb-8">Router Target: {{ $route.params.target }}</div>
  <div class="mt-8 mb-8">current: {{ current }}</div>
  <div class="mt-8 mb-8">pageSize: {{ pageSize }}</div>
  <div class="mt-8 mb-8">total: {{ total }}</div>
  <div v-if="error" class="mt-8 mb-8">error</div>
  <a-table
    :loading="loading"
    :columns="columns"
    :data-source="dataSource"
    :pagination="pagination.total <= pagination.pageSize ? false : pagination"
    @change="handleTableChange"
  ></a-table>
</template>

<style lang="scss" scoped></style>
