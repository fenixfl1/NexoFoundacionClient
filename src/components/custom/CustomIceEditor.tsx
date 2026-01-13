/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import type { IAceEditorProps } from 'react-ace'
import AceEditor from 'react-ace'
import styled from 'styled-components'

import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-min-noconflict/mode-sql'
import 'ace-builds/src-min-noconflict/mode-html'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/theme-tomorrow_night'
import 'ace-builds/src-min-noconflict/ext-language_tools'
import { Ace } from 'ace-builds'
import { ExperimentOutlined } from '@ant-design/icons'
import CustomButton from './CustomButton'
import CustomCard from './CustomCard'
import CustomSpin from './CustomSpin'
import CustomTooltip from './CustomTooltip'
import ConditionalComponent from '../ConditionalComponent'
import DisableContent from '../DisableContent'
import { useAppContext } from 'src/context/AppContext'

function getContext(
  editor: { session: { doc: { getAllLines: () => any } } },
  pos: { row: any }
) {
  const lines = editor.session.doc.getAllLines()
  const path = []

  for (let row = pos.row; row >= 0; row--) {
    const line = lines[row].trim()

    const matchField = /"([^"]+)":\s*\{?/.exec(line)
    if (matchField) {
      path.unshift(matchField[1])
      if (line.endsWith('{')) break
    }
  }

  if (path.includes('FIELDS') && !path.includes('format')) return 'FIELDS'
  if (path.includes('format')) return 'format'

  return null
}

const customCompleter = {
  getCompletions: function (
    editor: any,
    session: { getMode: () => { (): any; new (): any; $id: any } },
    pos: any,
    _prefix: any,
    callback: (arg0: null, arg1: any[]) => void
  ) {
    const mode = session.getMode().$id

    if (!mode.includes('json')) {
      callback(null, [])
      return
    }

    const context = getContext(editor, pos)
    let suggestions = []

    if (context === 'FIELDS') {
      suggestions = [
        { caption: 'title', value: 'title": ""', meta: 'field' },
        { caption: 'width', value: 'width": "60px"', meta: 'field' },
        { caption: 'align', value: 'align": "center"', meta: 'field' },
        { caption: 'format', value: 'format": {}', meta: 'object' },
      ]
    } else if (context === 'format') {
      suggestions = [
        { caption: 'type', value: 'type": "currency"', meta: 'field' },
        { caption: 'fix', value: 'fix": 2', meta: 'field' },
        { caption: 'prefix', value: 'prefix": "RD$"', meta: 'field' },
      ]
    }

    callback(null, suggestions)
  },
}

ace.require('ace/ext/language_tools').addCompleter(customCompleter)

const Card = styled(CustomCard)`
  margin: 5px 0;
  padding: 0 !important;
  position: relative;

  .test-btn {
    position: absolute;
    right: 10px;
    bottom: 10px;
    z-index: 1;
    border-radius: 50% !important;
    box-shadow: ${({ theme }) => theme.boxShadow} !important;
    color: ${({ theme }) => theme.primaryColor};
  }
`

interface CustomAceEditorProps extends IAceEditorProps {
  disabled?: boolean
  showTest?: boolean
  onTest?: (value: string) => void
  loading?: boolean
}

const CustomAceEditor: React.FC<CustomAceEditorProps> = ({
  disabled = false,
  mode = 'sql',
  theme: aceTheme,
  showPrintMargin = false,
  width = '100%',
  minLines = 5,
  maxLines = 10,
  name = 'sql-editor',
  placeholder = 'Escribe tu consulta sql',
  showGutter = true,
  fontSize = 16,
  onLoad,
  onTest,
  editorProps = { $blockScrolling: true },
  loading,
  setOptions = {
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true,
    tabSize: 2,
    showLineNumbers: true,
    useSoftTabs: true,
    behavioursEnabled: true,
  },
  showTest = false,
  value,
  ...props
}) => {
  const { theme: appTheme } = useAppContext()
  const editorTheme = React.useMemo(
    () => aceTheme ?? (appTheme === 'dark' ? 'tomorrow_night' : 'tomorrow'),
    [aceTheme, appTheme]
  )

  const handleOnLoad = (editor: Ace.Editor) => {
    editor.commands.addCommand({
      name: 'insertNewLine',
      bindKey: { win: 'Enter', mac: 'Enter' },
      exec: (editor) => editor.insert('\n'),
    })
    onLoad?.(editor)
  }

  return (
    <CustomSpin spinning={loading}>
      <DisableContent disabled={disabled}>
        <Card>
          <ConditionalComponent condition={showTest}>
            <CustomTooltip title={'Probar script'}>
              <CustomButton
                type={'text'}
                className={'test-btn'}
                shape={'circle'}
                icon={<ExperimentOutlined />}
                size={'large'}
                onClick={() => onTest?.(value)}
              />
            </CustomTooltip>
          </ConditionalComponent>
          <AceEditor
            editorProps={editorProps}
            fontSize={fontSize}
            maxLines={maxLines}
            minLines={minLines}
            mode={mode}
            name={name}
            onLoad={handleOnLoad}
            placeholder={placeholder}
            setOptions={setOptions}
            showGutter={showGutter}
            showPrintMargin={showPrintMargin}
            theme={editorTheme}
            width={width}
            value={value}
            {...props}
          />
        </Card>
      </DisableContent>
    </CustomSpin>
  )
}

export default CustomAceEditor
