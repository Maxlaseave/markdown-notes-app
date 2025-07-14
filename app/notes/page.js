'use client'

import SideNav from "@/components/SideNav";
import Editor from "@/components/Editor";
import MDX from "@/components/MDX";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useSearchParams } from "next/navigation";

export default function NotesPage() {
    const [isViewer, setIsViewer] = useState(true)
    // const [text, setText] = useState('')
    const [showNav, setShowNav] = useState(false)
    const [note, setNote] = useState({
        content: '' 
    })
    const [isLoading, setIsLoading] = useState(false)
    const [noteIds, setNoteIds] = useState([])
    const [savingNote, setSavingNote] = useState(false)
    
    const {currentUser, isLoadingUser} = useAuth()

    const searchParams = useSearchParams()

    function handleToggleViewer () {
        // isViewer = !isViewer
        console.log("ISVIEWER", isViewer);
        setIsViewer(!isViewer)

    }

    function handleToggleMenu () {
        setShowNav(!showNav)
    }

    function handleCreateNote() {
        setNote({
            content: ''
        })
        setIsViewer(false)
        window.history.replaceState(null, '', '/notes')
    }

    function handleEditNote(e) {
        setNote({...note, content: e.target.value})
    }

    async function handleSaveNote() {
        if(!note?.content) {return} 
        setSavingNote(true)

        try { 
            // check if note exists in db
            if(note.id) {
                // updating an existing note
                const noteRef = doc(db, 'users', currentUser.uid, 'notes', note.id)
                await setDoc(noteRef, {
                    ...note
                }, { merge: true })
            } else {
                // creating a new note
                const newId = note.content.replaceAll('#', '').slice(0, 15) + '__' + Date.now()
                const notesRef = doc(db, 'users', currentUser.uid, 'notes', newId)
                const newDocInfo = await setDoc(notesRef, {
                    content: note.content,
                    createdAt: serverTimestamp()
                })
                setNoteIds(curr => [...curr, newId])
                setNote({...note, id: newId})
                window.history.pushState(null, '', `?id=${newId}`)
            }

        } catch (err) {
            console.log(err.message)
        } finally {
            setSavingNote(false)
        }
    }

    // logic for fetching data

    useEffect(() => {
        // can locally cache notes in a global context
        const value = searchParams.get('id')

        if (!value) {
            console.warn('No note ID found in searchParams')
            return
        }

        if (!currentUser) {
            console.warn('No current user detected yet')
            return
        }


        async function fetchNote() {
            if(isLoading) { return }

            try {
                setIsLoading(true)
                console.log('Fetching note with ID:', value)
                // look up the reference
                const noteRef = doc(db, 'users', currentUser.uid, 'notes', value)
                const snapshot = await getDoc(noteRef)

                // if the docData exists, you access the .data(), else null
                const docData = snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : console.log('snapshot returned no data', snapshot)

                // then set the state
                if (docData){
                    setNote({ ...docData })
                }

            } catch(err) {
                console.log(err.message)
            } finally {
                setIsLoading(false)
            }
        }
        fetchNote()
    }, [currentUser, searchParams])


    if(isLoadingUser){
      return (
        <h6 className="text-gradiient">Loading...</h6>
      )
    }

    if(!currentUser) {
      window.location.href = '/'
    }


    return (
        <main id="notes">
            <SideNav setIsViewer={setIsViewer} handleCreateNote={handleCreateNote} noteIds={noteIds} setNoteIds={setNoteIds} showNav={showNav} setShowNav={setShowNav} />
            {!isViewer && (
                <Editor savingNote={savingNote} handleSaveNote={handleSaveNote} handleToggleMenu={handleToggleMenu} setText={handleEditNote} text={note.content} isViewer={isViewer} handleToggleViewer={handleToggleViewer}/>
            )}
            
           {isViewer && ( <MDX noteIds={noteIds} setNoteIds={setNoteIds} savingNote={savingNote} handleSaveNote={handleSaveNote} handleToggleMenu={handleToggleMenu} text={note.content}  isViewer={isViewer} handleToggleViewer={handleToggleViewer}/>)}
            
        </main>
    )
}