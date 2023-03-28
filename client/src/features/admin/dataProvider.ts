/* eslint-disable @typescript-eslint/no-explicit-any */
import simpleRestProvider from 'ra-data-simple-rest'
import { fetchUtils, type GetListResult, type GetListParams } from 'ra-core'
import { type RaRecord } from 'react-admin'
import { stringify } from 'query-string'

const apiUrl = '/api'

const httpClient = async (
  url: string,
  options?: fetchUtils.Options,
): Promise<{
  status: number
  headers: Headers
  body: string
  json: any
}> => {
  const { status, json, headers, body } = await fetchUtils.fetchJson(
    url,
    options,
  )
  const newHeaders = new Headers()

  headers.forEach((value, key) => {
    newHeaders.set(key, value)
  })
  newHeaders.set('Content-Range', 'whoknows 0-99/100')

  let data = json
  if (Array.isArray(json) && url.includes('areas')) {
    newHeaders.set('Content-Range', `areas 0-${data.length - 1}/${data.length}`)
  } else if (Array.isArray(json) && url.includes('accounts')) {
    data = json.map((account: Record<string, string>) => ({
      ...account,
      id: account.username,
    })) as Array<unknown>
    newHeaders.set(
      'Content-Range',
      `accounts 0-${data.length - 1}/${data.length}`,
    )
  }

  return { status, json: data, headers: newHeaders, body }
}

const defaultProvider = simpleRestProvider(apiUrl, httpClient)

const getList = (
  resource: string,
  params: GetListParams,
): Promise<GetListResult> => {
  const queryParams = {
    ...params.pagination,
    page: params.pagination.page - 1,
    sortBy: params.sort.field,
    order: params.sort.order,
  }
  const url = `${apiUrl}/${resource}/?${stringify(queryParams)}`
  const options = {}

  return httpClient(url, options).then(({ json }) => {
    return {
      data: json.data,
      total: json.pagination.total,
      pageInfo: {
        hasNextPage: json.pagination.hasNext,
        hasPreviousPage: json.pagination.hasPrevious,
      },
    }
  })
}

export const dataProvider: typeof defaultProvider = {
  ...defaultProvider,
  getMany: (resource) => {
    const url = `${apiUrl}/${resource}/`
    const options = {}

    return httpClient(url, options).then(({ json }) => {
      return {
        data: json.data,
        total: json.total,
      }
    })
  },
  getManyReference: getList,
  getList: getList,
  getOne: (resource, params) => {
    return httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => {
      return {
        data: json,
      }
    })
  },
  create: (resource, params) => {
    return httpClient(`${apiUrl}/${resource}/`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...json, id: 'id' in json ? json.id : '0' },
    }))
  },
  update: (resource, params) => {
    return httpClient(
      `${apiUrl}/${resource}/${resource !== 'accounts' ? params.id : ''}`,
      {
        method: 'PATCH',
        body: JSON.stringify(params.data),
      },
    ).then(({ json }) => {
      if (Array.isArray(json)) {
        return {
          data: json.find(
            (record: RaRecord) =>
              `${record.id || record.username}` === `${params.id}`,
          ),
        }
      }

      return { data: { ...json, id: 'id' in json ? json.id : params.id } }
    })
  },
  delete: (resource, params) => {
    return httpClient(
      `${apiUrl}/${resource}/${resource !== 'accounts' ? params.id : ''}`,
      {
        method: 'DELETE',
        body:
          resource === 'accounts'
            ? JSON.stringify({ usernames: [params.id] })
            : undefined,
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      },
    ).then(({ json }) => ({ data: json }))
  },
  deleteMany: async (resource, params) => {
    const responses = await (resource === 'accounts'
      ? httpClient(`${apiUrl}/${resource}/`, {
          method: 'DELETE',
          body: JSON.stringify({ usernames: params.ids }),
          headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }),
        }).then(({ json }) => json)
      : Promise.allSettled(
          params.ids.map((id) =>
            httpClient(`${apiUrl}/${resource}/${id}`, {
              method: 'DELETE',
              headers: new Headers({
                'Content-Type': 'application/json',
                Accept: 'application/json',
              }),
            }).then(({ json }) => json),
          ),
        ))
    const results = Array.isArray(responses) ? responses : [responses]
    return {
      data: results
        .filter(
          (result): result is PromiseFulfilledResult<any> =>
            result.status === 'fulfilled',
        )
        .map((result) => result.value),
    }
  },
}
