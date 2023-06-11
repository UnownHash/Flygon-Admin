import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const getColor = (percent = 0) => {
  switch (true) {
    case percent >= 95:
      return 'success'
    case percent >= 67:
      return 'warning'
    default:
      return 'error'
  }
}

export const ProgressBar = ({
  title,
  subtitle,
  ...props
}: LinearProgressProps & { title: string; subtitle: string }) => {
  return (
    <Box width="95%" my={3}>
      <Typography variant="h5" component="span">
        {title}
      </Typography>
      <Typography variant="subtitle1" component="span" pl={2}>
        {subtitle}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress
            color={getColor(props.value)}
            variant="determinate"
            sx={{
              transition: (theme) =>
                theme.transitions.create('bgcolor', {
                  duration: theme.transitions.duration.standard,
                  easing: theme.transitions.easing.easeInOut,
                }),
            }}
            {...props}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">
            {props.value}%
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
