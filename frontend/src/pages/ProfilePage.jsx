import {useMemo, useState, useEffect, useRef, useLayoutEffect} from 'react'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined'
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import CleaningServicesOutlinedIcon from '@mui/icons-material/CleaningServicesOutlined'
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const subjectsData = [
  {
    id: 1,
    name: 'Mathematics',
    icon: <CalculateOutlinedIcon color="primary" />,
    topics: ['Algebra', 'Geometry', 'Calculus', 'Statistics'],
  },
  {
    id: 2,
    name: 'Science',
    icon: <ScienceOutlinedIcon color="primary" />,
    topics: ['Biology', 'Chemistry', 'Physics', 'Earth Science'],
  },
  {
    id: 3,
    name: 'History',
    icon: <HistoryEduOutlinedIcon color="primary" />,
    topics: ['Ancient History', 'Medieval', 'Modern', 'World Wars'],
  },
  {
    id: 4,
    name: 'Languages',
    icon: <LanguageOutlinedIcon color="primary" />,
    topics: ['English', 'Spanish', 'French', 'German'],
  },
]

const collapsedWidth = 56
const expandedWidth = 220

export default function ProfilePage() {
  const [activeSubject, setActiveSubject] = useState('Mathematics')
  const [activeTopic, setActiveTopic] = useState('Algebra')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [mode, setMode] = useState('edit') // 'edit' | 'preview'

  const handleOpenMenu = (e) => setMenuAnchor(e.currentTarget)
  const handleCloseMenu = () => setMenuAnchor(null)

  const [noteContent, setNoteContent] = useState('<p>Start writing your notes here...</p>')
  const editorPaperRef = useRef(null)
  const statsRef = useRef(null)
  const [editorHeight, setEditorHeight] = useState(480)
  const [actionAnchor, setActionAnchor] = useState(null)

  const editor = useEditor({
    extensions: [StarterKit],
    content: noteContent,
    editorProps: {
      attributes: { style: 'padding: 12px; outline: none;' },
    },
    onUpdate: ({ editor }) => {
      setNoteContent(editor.getHTML())
    },
  })

  // Toggle editable based on mode
  useEffect(() => {
    if (editor) editor.setEditable(mode === 'edit')
  }, [editor, mode])

  // Dynamically size editor to end just above the bottom of the viewport
  useLayoutEffect(() => {
    const recalc = () => {
      const el = editorPaperRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const statsH = statsRef.current?.offsetHeight || 0
      const bottomGap = 12 + statsH // small gap + stats bar height
      const available = Math.max(240, Math.floor(window.innerHeight - rect.top - bottomGap))
      setEditorHeight(available)
    }
    // initial + listeners
    recalc()
    const ro = new ResizeObserver(recalc)
    ro.observe(document.body)
    window.addEventListener('resize', recalc)
    window.addEventListener('scroll', recalc, true)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', recalc)
      window.removeEventListener('scroll', recalc, true)
    }
  }, [])

  const subjects = useMemo(() => subjectsData, [])

  // Derive stats from content
  const stats = useMemo(() => {
    const tmp = document.createElement('div')
    tmp.innerHTML = noteContent || ''
    const text = tmp.textContent || tmp.innerText || ''
    const words = (text.trim().match(/\S+/g) || []).length
    const chars = text.length
    const readMinutes = Math.max(1, Math.ceil(words / 200))
    return { words, chars, readMinutes }
  }, [noteContent])

  const saveNote = () => {
    // Here you would typically save to your backend
    // eslint-disable-next-line no-console
    console.log('Note saved:', noteContent)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          backgroundImage: 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)',
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton color="inherit" edge="start" onClick={() => setSidebarCollapsed((v) => !v)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            EduNotes
          </Typography>

          <Tooltip title="Account">
            <Button
              color="inherit"
              onClick={handleOpenMenu}
              endIcon={<ExpandMoreIcon sx={{ transition: 'transform .15s', transform: menuAnchor ? 'rotate(180deg)' : 'none' }} />}
              sx={{ textTransform: 'none' }}
            >
              <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'secondary.main' }}>JD</Avatar>
              John Doe
            </Button>
          </Tooltip>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleCloseMenu}
            elevation={2}
          >
            <MenuItem onClick={handleCloseMenu}>
              <ListItemIcon><PersonOutlineIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Profile Settings" />
            </MenuItem>
            <MenuItem onClick={handleCloseMenu}>
              <ListItemIcon><NotificationsNoneIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Notifications" />
            </MenuItem>
            <MenuItem onClick={handleCloseMenu}>
              <ListItemIcon><SettingsOutlinedIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleCloseMenu}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Sign Out" />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: sidebarCollapsed ? collapsedWidth : expandedWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarCollapsed ? collapsedWidth : expandedWidth,
            boxSizing: 'border-box',
            bgcolor: '#ffffff',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflowY: 'auto', p: 2 }}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ display: 'block', textAlign: sidebarCollapsed ? 'center' : 'left', mb: 1 }}
          >
            {sidebarCollapsed ? '📚' : 'Subjects'}
          </Typography>
          <List dense>
            {subjects.map((subject) => {
              const isActive = activeSubject === subject.name
              return (
                <Box key={subject.id} sx={{ mb: 1 }}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => {
                        setActiveSubject(subject.name)
                        setActiveTopic(subject.topics[0])
                      }}
                      selected={isActive}
                      sx={{
                        borderLeft: isActive ? '4px solid #ef4444' : '4px solid transparent',
                        borderRadius: 1,
                        background: isActive ? 'linear-gradient(90deg, rgba(239,68,68,.08), rgba(249,115,22,.08))' : 'transparent',
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>{subject.icon}</ListItemIcon>
                      {!sidebarCollapsed && <ListItemText primary={subject.name} />}
                    </ListItemButton>
                  </ListItem>
                  {isActive && !sidebarCollapsed && (
                    <List dense sx={{ pl: 4 }}>
                      {subject.topics.map((topic) => (
                        <ListItem key={topic} disablePadding>
                          <ListItemButton
                            onClick={() => setActiveTopic(topic)}
                            selected={activeTopic === topic}
                            sx={{
                              borderRadius: 1,
                              '&.Mui-selected': {
                                background: 'linear-gradient(90deg, rgba(254,226,226,1), rgba(255,237,213,1))',
                              },
                            }}
                          >
                            <ListItemText primaryTypographyProps={{ fontSize: 13 }} primary={topic} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              )
            })}
            {!sidebarCollapsed && (
              <ListItem disablePadding sx={{ mt: 1 }}>
                <ListItemButton sx={{ borderRadius: 1, backgroundImage: 'linear-gradient(90deg,#ef4444,#f97316)', color: '#fff' }}>
                  <ListItemIcon sx={{ color: '#fff', minWidth: 36 }}>
                    <AddCircleOutlineIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add New Subject" />
                </ListItemButton>
              </ListItem>
            )}
          </List>

          {!sidebarCollapsed && (
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Quick Actions
              </Typography>
              <List dense>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon><FolderOutlinedIcon /></ListItemIcon>
                    <ListItemText primary="All Notes" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon><StarBorderOutlinedIcon /></ListItemIcon>
                    <ListItemText primary="Favorites" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon><HistoryOutlinedIcon /></ListItemIcon>
                    <ListItemText primary="Recent" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          )}
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Toolbar />
        <Container maxWidth={false} disableGutters sx={{ py: 2 }}>
          {/* Header + Editor section, full width */}
          <Box sx={{ minHeight: { xs: '82vh', md: '88vh' }, px: 0 }}>
            <Stack spacing={2} sx={{ mb: 2, px: 0 }} direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{activeTopic}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Subject: {activeSubject} • Last edited: Just now
                </Typography>
              </Box>
            </Stack>

            <Card variant="outlined" sx={{ overflow: 'hidden', width: '100%' }}>
              <CardHeader
                title="Content Editor"
                subheader={`Editing notes for ${activeTopic} in ${activeSubject}`}
                action={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton><SearchOutlinedIcon /></IconButton>
                    <IconButton><TuneOutlinedIcon /></IconButton>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<SaveOutlinedIcon />}
                      onClick={saveNote}
                      sx={{ backgroundImage: 'linear-gradient(90deg,#ef4444,#f97316)' }}
                    >
                      Save
                    </Button>
                    <IconButton onClick={(e) => setActionAnchor(e.currentTarget)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Stack>
                }
              />
              <Menu
                anchorEl={actionAnchor}
                open={Boolean(actionAnchor)}
                onClose={() => setActionAnchor(null)}
                elevation={2}
              >
                <MenuItem onClick={() => { console.log('Insert Image'); setActionAnchor(null) }}>
                  <ListItemIcon><ImageOutlinedIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Insert Image</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { console.log('Attach File'); setActionAnchor(null) }}>
                  <ListItemIcon><AttachFileOutlinedIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Attach File</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { console.log('Export PDF'); setActionAnchor(null) }}>
                  <ListItemIcon><PictureAsPdfOutlinedIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Export PDF</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { console.log('Share'); setActionAnchor(null) }}>
                  <ListItemIcon><ShareOutlinedIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Share</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => { setIsFavorite((v) => !v); setActionAnchor(null) }}>
                  <ListItemIcon>{isFavorite ? <FavoriteIcon fontSize="small" color="secondary" /> : <FavoriteBorderOutlinedIcon fontSize="small" />}</ListItemIcon>
                  <ListItemText>{isFavorite ? 'Unfavorite' : 'Favorite'}</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { setMode((m) => (m === 'edit' ? 'preview' : 'edit')); setActionAnchor(null) }}>
                  <ListItemIcon>{mode === 'edit' ? <VisibilityOutlinedIcon fontSize="small" /> : <CodeOutlinedIcon fontSize="small" />}</ListItemIcon>
                  <ListItemText>{mode === 'edit' ? 'Preview' : 'Edit'}</ListItemText>
                </MenuItem>
              </Menu>
              <CardContent sx={{ p: 0 }}>
                <Stack spacing={1.5} sx={{ width: '100%' }}>
                  {/* Toolbar */}
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ px: 0 }}>
                    <IconButton onClick={() => editor?.chain().focus().toggleBold().run()}><FormatBoldIcon /></IconButton>
                    <IconButton onClick={() => editor?.chain().focus().toggleItalic().run()}><FormatItalicIcon /></IconButton>
                    <IconButton onClick={() => editor?.chain().focus().toggleBulletList().run()}><FormatListBulletedIcon /></IconButton>
                    <IconButton onClick={() => editor?.chain().focus().toggleOrderedList().run()}><FormatListNumberedIcon /></IconButton>
                    <IconButton onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}><CleaningServicesOutlinedIcon /></IconButton>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                    {/* Edit mode toggle (code vs eye) */}
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant={mode === 'edit' ? 'contained' : 'outlined'}
                        startIcon={<CodeOutlinedIcon />}
                        onClick={() => setMode('edit')}
                        sx={{ borderWidth: mode === 'edit' ? undefined : 2 }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant={mode === 'preview' ? 'contained' : 'outlined'}
                        startIcon={<VisibilityOutlinedIcon />}
                        onClick={() => setMode('preview')}
                        sx={{ borderWidth: mode === 'preview' ? undefined : 2 }}
                      >
                        Preview
                      </Button>
                    </Stack>
                  </Stack>

                  {/* Editor (fills all free horizontal space and adjusts to viewport) */}
                  <Paper
                    ref={editorPaperRef}
                    variant="outlined"
                    sx={{
                      borderColor: 'divider',
                      width: '100%',
                      height: `${editorHeight}px`,
                      overflow: 'auto',
                      borderRadius: 0,
                      '& .ProseMirror': {
                        minHeight: '100%',
                        height: '100%',
                        width: '100%',
                        outline: 'none',
                        padding: '12px',
                      },
                    }}
                  >
                    <EditorContent editor={editor} />
                  </Paper>

                  {/* Thin stats bar */}
                  <Box
                      ref={statsRef}
                    sx={{
                      display: 'flex',
                      gap: { xs: 2, md: 3 },
                      fontSize: 12,
                      color: 'text.secondary',
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      pt: 1,
                      px: { xs: 1, sm: 2 },
                      flexWrap: 'wrap',
                      width: '100%',
                    }}
                  >
                    <span>{stats.words} words</span>
                    <span>{stats.chars} characters</span>
                    <span>~{stats.readMinutes} min read</span>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Floating actions in right corner */}
          <Box sx={{ position: 'fixed', right: 24, bottom: 24, zIndex: 2000 }}>
            <SpeedDial
              ariaLabel="Quick actions"
              icon={<SpeedDialIcon />}
              direction="up"
              FabProps={{
                sx: {
                  backgroundImage: 'linear-gradient(90deg,#ef4444,#f97316)',
                  color: '#fff',
                  '&:hover': { filter: 'brightness(0.95)' },
                },
              }}
            >
              <SpeedDialAction icon={<SaveOutlinedIcon />} tooltipTitle="Save" onClick={saveNote} />
              <SpeedDialAction icon={<ImageOutlinedIcon />} tooltipTitle="Insert Image" onClick={() => console.log('Insert Image')} />
              <SpeedDialAction icon={<AttachFileOutlinedIcon />} tooltipTitle="Attach File" onClick={() => console.log('Attach File')} />
              <SpeedDialAction icon={<PictureAsPdfOutlinedIcon />} tooltipTitle="Export PDF" onClick={() => console.log('Export PDF')} />
              <SpeedDialAction icon={<ShareOutlinedIcon />} tooltipTitle="Share" onClick={() => console.log('Share')} />
              <SpeedDialAction
                icon={isFavorite ? <FavoriteIcon color="secondary" /> : <FavoriteBorderOutlinedIcon />}
                tooltipTitle={isFavorite ? 'Unfavorite' : 'Favorite'}
                onClick={() => setIsFavorite((v) => !v)}
              />
              <SpeedDialAction
                icon={mode === 'edit' ? <VisibilityOutlinedIcon /> : <CodeOutlinedIcon />}
                tooltipTitle={mode === 'edit' ? 'Preview' : 'Edit'}
                onClick={() => setMode((m) => (m === 'edit' ? 'preview' : 'edit'))}
              />
            </SpeedDial>
          </Box>

          {/* Recent Activity separated and appears after scroll */}
          <Box sx={{ px: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Card sx={{ flex: 1, borderColor: '#fecaca', background: 'linear-gradient(90deg,#fff1f2,#fff7ed)' }} variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: '#fee2e2', color: '#ef4444' }}><NoteAddOutlinedIcon /></Avatar>
                    <Box>
                      <Typography fontWeight={600} color="#b91c1c">Document Created</Typography>
                      <Typography variant="body2" color="#ef4444">2 minutes ago</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
              <Card sx={{ flex: 1, borderColor: '#fed7aa', background: 'linear-gradient(90deg,#fff7ed,#fffbeb)' }} variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: '#ffedd5', color: '#f97316' }}><EditOutlinedIcon /></Avatar>
                    <Box>
                      <Typography fontWeight={600} color="#9a3412">Content Updated</Typography>
                      <Typography variant="body2" color="#f97316">Just now</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Container>

        <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: '#fff', py: 3 }}>
          <Container maxWidth={false} disableGutters>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center" sx={{ px: { xs: 2, sm: 3 } }}>
              <Typography variant="body2" color="text.secondary">© 2024 EduNotes • Making education accessible</Typography>
              <Stack direction="row" spacing={3}>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>Support</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>Documentation</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>API</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>Status</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">v1.2.0</Typography>
                <Typography variant="body2" color="#16a34a">●</Typography>
                <Typography variant="body2" color="text.secondary">Online</Typography>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Box>
  )
}
