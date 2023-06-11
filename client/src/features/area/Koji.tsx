import { useState } from 'react'
import { Button, useNotify } from 'react-admin'
import { useMutation } from 'react-query'
import { useRecordContext, useUpdate } from 'ra-core'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'

import { Area, KojiOptions, KojiResponse } from '@features/area/type'

export const SendKojiRequest = ({
  endpoint,
  field,
  children,
  options,
  onClick,
}: {
  onClick: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
  children: React.ReactNode
  endpoint: string
  options: KojiOptions
  field: 'pokemon_mode' | 'fort_mode' | 'quest_mode'
}) => {
  const area = useRecordContext<Area>()
  const [update, { error }] = useUpdate<Area>('areas')
  const notify = useNotify()

  const request = useMutation(
    [],
    () => {
      return fetch(`/api/v1/calc/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...options,
          area: area.geofence,
          last_seen: Math.floor((Date.now() - 1000 * 60 * 60 * 24 * 30) / 1000),
        }),
      }).then((res) => res.json())
    },
    {
      onSuccess: (resp: KojiResponse) => {
        if (resp?.data) {
          update(
            'areas',
            {
              id: area.id,
              data: {
                ...area,
                [field]: {
                  ...area[field],
                  route: resp.data,
                },
              },
              previousData: area,
            },
            {
              onError: () =>
                notify(`Kōji request failed for ${area.name} - ${error}`, {
                  type: 'error',
                }),
            },
          )
          notify(`Kōji Request sent for ${area.name}`, { type: 'success' })
        }
      },
      onError: () => {
        notify(`Kōji request failed for ${area.name}`, { type: 'error' })
      },
    },
  )

  return (
    <MenuItem
      onClick={(event) => {
        event.stopPropagation()
        request.mutate()
        onClick(event)
      }}
    >
      {children}
    </MenuItem>
  )
}

export const KojiMenuButton = ({
  bulk = false,
  children,
}: {
  bulk?: boolean
  children?: React.ReactNode
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.stopPropagation()
    setAnchorEl(null)
  }

  return (
    <div>
      {bulk ? (
        <Button label="Kōji Options" onClick={handleClick} />
      ) : (
        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
      )}
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
        <SendKojiRequest
          endpoint="bootstrap"
          options={{
            radius: 70,
          }}
          field="pokemon_mode"
          onClick={handleClose}
        >
          Bootstrap 70m
        </SendKojiRequest>
        <SendKojiRequest
          endpoint="bootstrap"
          options={{
            s2_level: 15,
            s2_size: 9,
            calculation_mode: 'S2',
          }}
          field="pokemon_mode"
          onClick={handleClose}
        >
          Bootstrap 9x9
        </SendKojiRequest>
        <SendKojiRequest
          endpoint="route/spawnpoint"
          options={{
            radius: 70,
            min_points: 3,
            cluster_mode: 'Balanced',
            fast: false,
          }}
          field="pokemon_mode"
          onClick={handleClose}
        >
          Route 70m Pokemon
        </SendKojiRequest>
        {/* <SendKojiRequest
          endpoint="route/pokestop"
          options={{
            radius: 78,
            cluster_mode: 'Balanced',
            fast: false,
          }}
          field="quest_mode"
          onClick={handleClose}
        >
          Route Quests
        </SendKojiRequest>
        <SendKojiRequest
          endpoint="route/gym"
          options={{
            s2_level: 15,
            s2_size: 9,
            calculation_mode: 'S2',
          }}
          field="fort_mode"
          onClick={handleClose}
        >
          Route Gyms
        </SendKojiRequest> */}
        {children}
      </Menu>
    </div>
  )
}
