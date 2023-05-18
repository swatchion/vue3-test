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
      title: "Name",
      dataIndex: "name",
      sorter: true,
      width: "20%",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      filters: [
        {
          text: "Male",
          value: "male",
        },
        {
          text: "Female",
          value: "female",
        },
      ],
      width: "20%",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Nation",
      dataIndex: "nat",
      filters: [
        {
          text: "Canada",
          value: "CA",
        },
        {
          text: "New Zealand",
          value: "NZ",
        },
      ],
    },
  ];

  const userRequest = (params = { page, results }) => {
    return axios.get("https://randomuser.me/api?noinfo", {
      params,
    });
  };

  const { data, run, loading, params, current, pageSize, total } =
    usePagination(userRequest, {
      defaultParams: [
        {
          page: 1,
          results: 10,
        },
      ],
      pagination: {
        currentKey: "page",
        pageSizeKey: "results",
      },
    });

  const dataSource = computed(() => {
    // data 是由 usePagination 解包
    // data 是 AjaxResponse: {config,data,headers, request,status, statusText}
    // 其中 AjaxResponse.data 为接口返回的实际 json 数据
    // 对照 dataSource 的计算值为 data.data(响应体Payload).dataRow(应该为数组值)
    return data.value?.data.results;
  });

  const pagination = computed(() => ({
    total: 200,
    current: current.value,
    pageSize: pageSize.value,
  }));

  const handleTableChange = (pag, filters, sorter) => {
    run({
      results: pag.pageSize,
      page: pag?.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
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

<style scoped></style>
