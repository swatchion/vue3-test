<script setup>
  import { reactive, ref, onBeforeMount, toRef, computed } from "vue";

  import { usePagination } from "vue-request";
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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Gid",
      dataIndex: "gid",
    },
    {
      title: "Name",
      dataIndex: "remote_name",
    },
    {
      title: "Hot",
      dataIndex: "hot",
      filters: [
        {
          text: "是",
          value: "1",
        },
        {
          text: "否",
          value: "0",
        },
      ],
    },
    {
      title: "Enabled",
      dataIndex: "enabled",
      filters: [
        {
          text: "是",
          value: "1",
        },
        {
          text: "否",
          value: "0",
        },
      ],
    },
  ];

  const userRequest = (params = { current, pageSize }) => {
    return axios.get("http://127.0.0.1:9501/api/test/data", {
      params,
    });
  };

  // $current = $this->request->input('current', 1);
  // $pageSize = $this->request->input('pageSize', 10);
  // $filter = $this->request->input('filter',[]);
  // $sorter = $this->request->input('sorter',[]);

  const { data, run, loading, params, current, pageSize, total } =
    usePagination(userRequest, {
      defaultParams: [
        {
          current: 1,
          pageSize: 10,
          filter: [],
          sorter: [],
        },
      ],
      pagination: {
        // currentKey: "data.current_page",
        // pageSizeKey: "data.per_page",
        totalKey: "data.total",
      },
    });

  const dataSource = computed(() => {
    // data 是由 usePagination 解包
    // data 是 AjaxResponse: {config,data,headers, request,status, statusText}
    // 其中 AjaxResponse.data 为接口返回的实际 json 数据
    // 对照 dataSource 的计算值为 data.data(响应体Payload).dataRow(应该为数组值)
    return data.value?.data.data;
  });

  const pagination = computed(() => ({
    current: current.value,
    pageSize: pageSize.value,
    total: total.value,
  }));

  const handleTableChange = (pager, filters, sorter) => {
    console.log("pager", pager);

    run({
      current: pager?.current,
      pageSize: pager.pageSize,
    });
  };

  // const handleTableChange = (pag, filters, sorter) => {
  //   run({
  //     results: pag.pageSize,
  //     page: pag?.current,
  //     sortField: sorter.field,
  //     sortOrder: sorter.order,
  //     ...filters,
  //   });
  // };

  onBeforeMount(() => {
    console.log("Mount data", data);
    console.log("Mount params", params.value);
    console.log("Mount dataSource", dataSource);
    console.log("Mount current", current.value);
    console.log("Mount pageSize", pageSize.value);
    console.log("Mount total", total.value);
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

<style scoped></style>
